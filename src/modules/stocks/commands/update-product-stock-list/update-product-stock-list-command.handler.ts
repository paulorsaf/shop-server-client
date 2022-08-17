import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { ProductsPurchasedTotalStockUpdatedEvent } from "./events/products-purchased-total-stock-updated.event";
import { UpdateProductStockListCommand } from "./update-product-stock-list.command";

@CommandHandler(UpdateProductStockListCommand)
export class UpdateProductStockListCommandHandler implements ICommandHandler<UpdateProductStockListCommand> {

    constructor(
        private eventBus: EventBus
    ){}

    async execute(command: UpdateProductStockListCommand) {
        const products = command.products;

        await Promise.all(products.map(p => p.updateTotalStock()));

        this.eventBus.publish(
            new ProductsPurchasedTotalStockUpdatedEvent(
                command.companyId, command.purchaseId,
                command.products.map(p => ({
                    productId: p.getId(),
                    totalStock: p.getTotalStock()
                })),
                command.updatedBy
            )
        )
    }

}