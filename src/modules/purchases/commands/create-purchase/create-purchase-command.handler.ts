import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { ProductOutOfStockException } from "../../exceptions/purchase.exceptions";
import { CreatePurchaseProduct } from "../../model/create-purchase-product.model";
import { CreatePurchase } from "../../model/create-purchase.model";
import { ProductRepository } from "../../repositories/product.repository";
import { PurchaseRepository } from "../../repositories/purchase.repository";
import { CreatePurchaseCommand } from './create-purchase.command';
import { PurchaseCreatedEvent } from "./events/purchase-created.event";

@CommandHandler(CreatePurchaseCommand)
export class CreatePurchaseCommandHandler implements ICommandHandler<CreatePurchaseCommand> {

    constructor(
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
        return new CreatePurchase({
            companyId: command.companyId,
            payment: {
                type: command.purchase.payment.type
            },
            products: await this.createProductModel(command),
            user: {
                email: command.user.email,
                id: command.user.id
            }
        })
    }

    private async createProductModel(command: CreatePurchaseCommand){
        return await Promise.all(
            command.purchase.products.map(async p => {
                const product = await this.productRepository.findByIdWithStock(
                    p.productId, p.stockOptionId
                );
                const purchaseProduct = new CreatePurchaseProduct({
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
        command: CreatePurchaseCommand, purchase: CreatePurchase, purchaseId: string
    ) {
        this.eventBus.publish(new PurchaseCreatedEvent(
            command.companyId,
            purchaseId,
            purchase,
            command.purchase.payment,
            command.user.id
        ))
    }

}