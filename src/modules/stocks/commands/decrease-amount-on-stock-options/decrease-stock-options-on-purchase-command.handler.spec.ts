import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { DecreaseStockOptionsOnPurchaseCommandHandler } from './decrease-stock-options-on-purchase-command.handler';
import { DecreaseStockOptionsOnPurchaseCommand } from './decrease-stock-options-on-purchase.command';
import { ProductRepository } from '../../repositories/product.repository';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { Purchase } from '../../../purchases/model/purchase.model';
import { ProductsPurchasedDecreasedStockEvent } from './events/products-purchases-decreased-stock.event';

describe('DecreaseStockOptionsOnPurchaseCommandHandler', () => {

  let eventBus: EventBusMock;
  let handler: DecreaseStockOptionsOnPurchaseCommandHandler;

  let product1: ProductMock;
  let product2: ProductMock;
  let purchase: Purchase;
  let command: DecreaseStockOptionsOnPurchaseCommand;

  beforeEach(async () => {
    product1 = new ProductMock("productId1", "stockId1", 10);
    product2 = new ProductMock("productId2", "stockId2", 20);
    purchase = new Purchase({
      companyId: "anyCompanyId", id: "anyPurchaseId", products: [product1, product2] as any,
      payment: {} as any, userId: "anyUserId"
    });
    command = new DecreaseStockOptionsOnPurchaseCommand(
      "anyCompanyId", "anyPurchaseId", [product1, product2] as any, "anyUserId"
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
        ProductRepository
      ]
    })
    .overrideProvider(EventBus).useValue(eventBus)
    .compile();

    handler = module.get<DecreaseStockOptionsOnPurchaseCommandHandler>(DecreaseStockOptionsOnPurchaseCommandHandler);
  });

  it('given purchase, then decrease stock on each purchase product stock', async () => {
    await handler.execute(command);

    expect(product1._hasDecreased).toBeTruthy();
    expect(product2._hasDecreased).toBeTruthy();
  })

  it('given stock decreased, then publish purchase stock decreased event', async () => {
    await handler.execute(command);

    expect(eventBus.published).toEqual(
      new ProductsPurchasedDecreasedStockEvent(
        "anyCompanyId", "anyPurchaseId", [
          { amount: 10, productId: "productId1", stockId: "stockId1" },
          { amount: 20, productId: "productId2", stockId: "stockId2" }
        ], "anyUserId"
      )
    );
  })

});

class ProductMock {
  _hasDecreased = false;

  constructor(
    public productId: string,
    public stockId: string,
    public amount: number
  ){}

  decreaseAmountOnStock() {
    this._hasDecreased = true;
  }

  getAmount() {
    return this.amount;
  }
  getId() {
    return this.productId;
  }
  getTotalStock() {
    return this.amount;
  }
  getStock() {
    return {
      getId: () => this.stockId
    }
  }
}