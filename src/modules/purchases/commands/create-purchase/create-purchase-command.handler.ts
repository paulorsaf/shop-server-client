import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { PurchasePriceService } from "../../../../services/purchase-price.service";
import { ProductOutOfStockException } from "../../exceptions/purchase.exceptions";
import { PurchaseProduct } from "../../model/purchase-product.model";
import { Purchase } from "../../model/purchase.model";
import { ProductRepository } from "../../repositories/product.repository";
import { PurchaseRepository } from "../../repositories/purchase.repository";
import { CreatePurchaseCommand } from './create-purchase.command';
import { PurchaseCreatedEvent } from "./events/purchase-created.event";

@CommandHandler(CreatePurchaseCommand)
export class CreatePurchaseCommandHandler implements ICommandHandler<CreatePurchaseCommand> {

    constructor(
        private purchasePriceService: PurchasePriceService,
        private eventBus: EventBus,
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
            payment: {
                type: command.purchase.payment.type
            },
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

    private async calculatePrice(command: CreatePurchaseCommand, products: PurchaseProduct[]) {
        const pricing = await this.purchasePriceService.calculatePrice({
            address: command.purchase.deliveryAddress ? {
                destinationZipCode: command.purchase.deliveryAddress.zipCode,
                originZipCode: command.company.zipCode
            } : null,
            cityDeliveryPrice: command.company.cityDeliveryPrice,
            companyCity: command.company.companyCity,
            payment: command.company.payment,
            paymentType: command.purchase.payment.type,
            products: products.map(p => ({
                amount: p.amount,
                price: p.price,
                priceWithDiscount: p.priceWithDiscount,
                weight: p.weight
            }))
        })
        return pricing;
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