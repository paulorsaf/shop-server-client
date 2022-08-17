import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateProductStockListCommandHandler } from './update-product-stock-list-command.handler';
import { UpdateProductStockListCommand } from './update-product-stock-list.command';
import { ProductRepository } from '../../repositories/product.repository';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { ProductsPurchasedTotalStockUpdatedEvent } from './events/products-purchased-total-stock-updated.event';

describe('UpdateProductStockListCommandHandler', () => {

  let eventBus: EventBusMock;
  let handler: UpdateProductStockListCommandHandler;
  
  let product1: ProductMock;
  let product2: ProductMock;
  let command: UpdateProductStockListCommand;

  beforeEach(async () => {
    eventBus = new EventBusMock();

    product1 = new ProductMock("anyProductId1", 10);
    product2 = new ProductMock("anyProductId2", 20);
    command = new UpdateProductStockListCommand(
      "anyCompanyId", "anyPurchaseId", [
        product1, product2
      ] as any, "anyUserId"
    )

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        UpdateProductStockListCommandHandler
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

    handler = module.get<UpdateProductStockListCommandHandler>(UpdateProductStockListCommandHandler);
  });

  it('given products, then update products total stock', async () => {
    await handler.execute(command);

    const hasUpdatedAllProducts = 
      product1._hasUpdatedTotalStock && product2._hasUpdatedTotalStock;

    expect(hasUpdatedAllProducts).toBeTruthy();
  })

  it('given products total stock has been updated, then publish purchase products total stock updated', async () => {
    await handler.execute(command);

    expect(eventBus.published).toEqual(
      new ProductsPurchasedTotalStockUpdatedEvent(
        "anyCompanyId", "anyPurchaseId", [
          {productId: "anyProductId1", totalStock: 10},
          {productId: "anyProductId2", totalStock: 20}
        ],
        "anyUserId"
      )
    );
  })

});

class ProductMock {
  _id;
  _totalStock;
  _hasUpdatedTotalStock = false;

  constructor(id: string, totalStock: number){
    this._id = id;
    this._totalStock = totalStock;
  }

  getId() {
    return this._id;
  }
  getTotalStock() {
    return this._totalStock;
  }
  updateTotalStock() {
    this._hasUpdatedTotalStock = true;
  }
}