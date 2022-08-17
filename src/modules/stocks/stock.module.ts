import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { DecreaseStockOptionsOnPurchaseCommandHandler } from './commands/decrease-amount-on-stock-options/decrease-stock-options-on-purchase-command.handler';
import { ProductsPurchasedDecreasedStockEvent } from './commands/decrease-amount-on-stock-options/events/products-purchases-decreased-stock.event';
import { ProductsPurchasedTotalStockUpdatedEvent } from './commands/update-product-stock-list/events/products-purchased-total-stock-updated.event';
import { UpdateProductStockListCommandHandler } from './commands/update-product-stock-list/update-product-stock-list-command.handler';
import { ProductRepository } from './repositories/product.repository';
import { StockRepository } from './repositories/stock.repository';
import { StockSagas } from './sagas/stock.saga';

@Module({
  imports: [
    CqrsModule
  ],
  providers: [
    ProductRepository,
    StockRepository,

    DecreaseStockOptionsOnPurchaseCommandHandler,
    UpdateProductStockListCommandHandler,

    ProductsPurchasedDecreasedStockEvent,
    ProductsPurchasedTotalStockUpdatedEvent,

    StockSagas
  ]
})
export class StockModule {}
