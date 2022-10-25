import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { StockRepository } from "../../repositories/stock.repository";
import { DecreaseStockOptionsOnPurchaseCommand } from "./decrease-stock-options-on-purchase.command";
import { ProductsPurchasedDecreasedStockEvent } from "./events/products-purchases-decreased-stock.event";

@CommandHandler(DecreaseStockOptionsOnPurchaseCommand)
export class DecreaseStockOptionsOnPurchaseCommandHandler implements ICommandHandler<DecreaseStockOptionsOnPurchaseCommand> {

    constructor(
        private eventBus: EventBus,
        private stockRepository: StockRepository
    ){}

    async execute(command: DecreaseStockOptionsOnPurchaseCommand) {
        const products = command.products;

        await Promise.all(products.map(p => {
            let decreaseBy = p.amount;
            if (p.unit === "KG") {
                decreaseBy = p.amount * p.weight;
            }

            this.stockRepository.descreaseQuantityBy({
                decreaseBy,
                id: p.stock.id
            })
        }))

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
                    amount: p.amount,
                    productId: p.productId,
                    stockId: p.stock.id
                })),
                command.userId
            )
        )
    }

}