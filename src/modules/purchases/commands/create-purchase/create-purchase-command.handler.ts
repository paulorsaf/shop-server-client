import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { ProductOutOfStockException } from "../../exceptions/purchase.exceptions";
import { CreatePurchaseCommand } from './create-purchase.command';
import { PurchaseCreatedEvent } from "./events/purchase-created.event";

@CommandHandler(CreatePurchaseCommand)
export class CreatePurchaseCommandHandler implements ICommandHandler<CreatePurchaseCommand> {

    constructor(
        private eventBus: EventBus,
    ){}
    
    async execute(command: CreatePurchaseCommand) {
        const purchase = command.purchase;

        await purchase.loadAllProducts();

        const outOfStockProduct = purchase.findProductOutOfStock();
        if (outOfStockProduct) {
            throw new ProductOutOfStockException(outOfStockProduct.getName());
        }

        await purchase.save();

        this.eventBus.publish(new PurchaseCreatedEvent(
            purchase.getCompanyId(), purchase, purchase.getUserId()
        ))
    }

}