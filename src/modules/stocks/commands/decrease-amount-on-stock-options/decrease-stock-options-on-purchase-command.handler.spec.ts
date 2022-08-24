import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { DecreaseStockOptionsOnPurchaseCommandHandler } from './decrease-stock-options-on-purchase-command.handler';
import { DecreaseStockOptionsOnPurchaseCommand } from './decrease-stock-options-on-purchase.command';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { ProductsPurchasedDecreasedStockEvent } from './events/products-purchases-decreased-stock.event';
import { StockRepository } from '../../repositories/stock.repository';

describe('DecreaseStockOptionsOnPurchaseCommandHandler', () => {

  let command: DecreaseStockOptionsOnPurchaseCommand;
  let handler: DecreaseStockOptionsOnPurchaseCommandHandler;
  
  let eventBus: EventBusMock;
  let stockRepository: StockRepositoryMock;

  beforeEach(async () => {
    stockRepository = new StockRepositoryMock();

    command = new DecreaseStockOptionsOnPurchaseCommand(
      "anyCompanyId", "anyPurchaseId", [{
        amount: 10,
        productId: "productId1",
        stock: {
          id: "anyStockId1"
        }
      }, {
        amount: 20,
        productId: "productId2",
        stock: {
          id: "anyStockId2"
        }
      }] as any, "anyUserId"
    );

    eventBus = new EventBusMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        DecreaseStockOptionsOnPurchaseCommandHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        StockRepository
      ]
    })
    .overrideProvider(StockRepository).useValue(stockRepository)
    .overrideProvider(EventBus).useValue(eventBus)
    .compile();

    handler = module.get<DecreaseStockOptionsOnPurchaseCommandHandler>(DecreaseStockOptionsOnPurchaseCommandHandler);
  });

  it('given purchase, then decrease stock on each purchase product stock', async () => {
    await handler.execute(command);

    expect(stockRepository._calledTimes).toEqual(2);
  })

  it('given stock decreased, then publish purchase stock decreased event', async () => {
    await handler.execute(command);

    expect(eventBus.published).toEqual(
      new ProductsPurchasedDecreasedStockEvent(
        "anyCompanyId", "anyPurchaseId", [
          { amount: 10, productId: "productId1", stockId: "anyStockId1" },
          { amount: 20, productId: "productId2", stockId: "anyStockId2" }
        ], "anyUserId"
      )
    );
  })

});

class StockRepositoryMock {
  _calledTimes = 0;
  descreaseQuantityBy() {
    this._calledTimes++;
  }
}