import { NotFoundException } from '@nestjs/common';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { ProductOutOfStockException } from '../../exceptions/purchase.exceptions';
import { CreatePurchaseCommandHandler } from './create-purchase-command.handler';
import { CreatePurchaseCommand } from './create-purchase.command';
import { PurchaseCreatedEvent } from './events/purchase-created.event';

describe('CreatePurchaseCommandHandler', () => {

  let eventBus: EventBusMock;
  let handler: CreatePurchaseCommandHandler;

  let company = {id: "anyCompanyId"} as any;
  let user = {id: "anyUserId"} as any;
  let command: CreatePurchaseCommand;
  const payment = {type: "anyType"};

  let purchase: PurchaseMock;

  beforeEach(async () => {
    purchase = new PurchaseMock();
    command = new CreatePurchaseCommand(
      company, purchase as any, payment, user
    );

    eventBus = new EventBusMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        CreatePurchaseCommandHandler
      ],
      imports: [
        CqrsModule
      ]
    })
    .overrideProvider(EventBus).useValue(eventBus)
    .compile();

    handler = module.get<CreatePurchaseCommandHandler>(CreatePurchaseCommandHandler);
  });

  it('given create purchase, then load all purchase products', async () => {
    await handler.execute(command);

    expect(purchase._hasLoadedAllProducts).toBeTruthy();
  })

  it('given amount of products is higher then products on stock, then throw exception', async () => {
    purchase._productOutOfStock = {name: "anyProductName", getName: () => "anyName"};

    await expect(handler.execute(command)).rejects.toThrowError(ProductOutOfStockException);
  })

  it('given create purchase, then save purchase', async () => {
    await handler.execute(command);

    expect(purchase._hasSaved).toBeTruthy();
  })

  it('given purchase created, then publish purchase created event', async () => {
    await handler.execute(command);

    expect(eventBus.published).toEqual(
      new PurchaseCreatedEvent(
        "anyCompanyId",
        "anyPurchaseId",
        purchase as any,
        payment,
        "anyUserId"
      )
    );
  })

});

class PurchaseMock {
  _hasLoadedAllProducts;
  _hasSaved;
  _productOutOfStock;

  findProductOutOfStock() {
    return this._productOutOfStock;
  }
  getCompanyId() {
    return "anyCompanyId";
  }
  getUserId() {
    return "anyUserId";
  }
  getId() {
    return "anyPurchaseId";
  }
  loadAllProducts() {
    this._hasLoadedAllProducts = true;
  }
  save() {
    this._hasSaved = true;
  }
}