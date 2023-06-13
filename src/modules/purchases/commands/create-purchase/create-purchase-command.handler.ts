import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { PurchasePrice } from "shop-purchase-price";
import { ProductOutOfStockException } from "../../exceptions/purchase.exceptions";
import { Cupom } from "../../model/cupom.model";
import { PurchaseProduct } from "../../model/purchase-product.model";
import { Purchase } from "../../model/purchase.model";
import { CupomRepository } from "../../repositories/cupom.repository";
import { ProductRepository } from "../../repositories/product.repository";
import { PurchaseRepository } from "../../repositories/purchase.repository";
import { CreatePurchaseCommand } from './create-purchase.command';
import { PurchaseCreatedEvent } from "./events/purchase-created.event";

@CommandHandler(CreatePurchaseCommand)
export class CreatePurchaseCommandHandler implements ICommandHandler<CreatePurchaseCommand> {

    constructor(
        private eventBus: EventBus,
        private cupomRepository: CupomRepository,
        private productRepository: ProductRepository,
        private purchaseRepository: PurchaseRepository
    ){}
    
    async execute(command: CreatePurchaseCommand) {
        const purchase = await this.createPurchaseModel(command);

        const id = await this.purchaseRepository.create(purchase);

        this.publishPurchaseCreatedEvent(command, purchase, id);
    }

    private async createPurchaseModel(command: CreatePurchaseCommand) {
        const products = await this.createProductModel(command);

        const pricing = await this.calculatePrice(command, products);

        const purchase = new Purchase({
            address: command.purchase.deliveryAddress,
            companyId: command.company.id,
            deliveryPrice: command.purchase.deliveryPrice,
            payment: command.purchase.payment ? {
                cupom: command.purchase.payment.cupom?.toUpperCase(),
                type: command.purchase.payment.type
            } : undefined,
            productNotes: command.purchase.productNotes,
            products,
            user: {
                email: command.user.email,
                id: command.user.id
            }
        });
        purchase.setPrice(pricing);

        return purchase;
    }

    private async calculatePrice(
        command: CreatePurchaseCommand,
        products: PurchaseProduct[]
    ) {
        const discount = await this.findDiscount(command);

        const pricing = await new PurchasePrice({
            addresses: command.purchase.deliveryAddress ? {
                destination: command.purchase.deliveryAddress.zipCode,
                origin: command.company.zipCode
            } : null,
            innerCityDeliveryPrice: command.company.cityDeliveryPrice,
            originCityName: command.company.companyCity,
            discount,
            hasDeliveryByMail: command.company.hasDeliveryByMail,
            paymentFee: command.purchase.payment?.type === 'CREDIT_CARD' ? {
                percentage: command.company.payment?.creditCard?.fee?.percentage || 0,
                value: command.company.payment?.creditCard?.fee?.value || 0
            } : null,
            products: products.map(p => ({
                amount: p.amount,
                price: p.price,
                priceWithDiscount: p.priceWithDiscount,
                weight: p.weight
            })),
            serviceFee: command.company.serviceTax
        }).calculatePrice();

        return pricing;
    }

    private async findDiscount(command: CreatePurchaseCommand): Promise<number> {
        if (!command.purchase.payment?.cupom) {
            return 0;
        }

        const cupom = await this.cupomRepository.find({
            companyId: command.company.id,
            cupom: command.purchase.payment?.cupom
        });
        return cupom?.discount || 0;
    }

    private async createProductModel(command: CreatePurchaseCommand){
        return await Promise.all(
            command.purchase.products.map(async p => {
                const product = await this.productRepository.findByIdWithStock(
                    p.productId, p.stockOptionId
                );
                const purchaseProduct = new PurchaseProduct({
                    ...product,
                    address: command.purchase.deliveryAddress,
                    amount: p.amount
                })

                if (!purchaseProduct.hasEnoughItemsOnStock()) {
                    throw new ProductOutOfStockException(purchaseProduct.name);
                }
                return purchaseProduct;
            })
        )
    }

    private publishPurchaseCreatedEvent(
        command: CreatePurchaseCommand, purchase: Purchase, purchaseId: string
    ) {
        this.eventBus.publish(
            new PurchaseCreatedEvent(
                command.company.id,
                purchaseId,
                purchase,
                command.purchase.payment,
                command.user.id
            )
        )
    }

}