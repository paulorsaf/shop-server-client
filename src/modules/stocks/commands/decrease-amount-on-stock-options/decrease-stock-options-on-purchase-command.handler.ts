import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { DecreaseStockOptionsOnPurchaseCommand } from "./decrease-stock-options-on-purchase.command";
import { ProductsPurchasedDecreasedStockEvent } from "./events/products-purchases-decreased-stock.event";

@CommandHandler(DecreaseStockOptionsOnPurchaseCommand)
export class DecreaseStockOptionsOnPurchaseCommandHandler implements ICommandHandler<DecreaseStockOptionsOnPurchaseCommand> {

    constructor(
        private eventBus: EventBus
    ){}

    async execute(command: DecreaseStockOptionsOnPurchaseCommand) {
        const products = command.products;
        
        await Promise.all(products.map(p => p.decreaseAmountOnStock()));

        this.publishProductsPurchasedDecreasedStockEvent(command);
    }

    private publishProductsPurchasedDecreasedStockEvent(
        command: DecreaseStockOptionsOnPurchaseCommand
    ) {
        this.eventBus.publish(
            new ProductsPurchasedDecreasedStockEvent(
                command.companyId,
                command.purchaseId,
                command.products.map(p => ({
                    amount: p.getAmount(),
                    productId: p.getId(),
                    stockId: p.getStock().getId()
                })),
                command.userId
            )
        )
    }

}