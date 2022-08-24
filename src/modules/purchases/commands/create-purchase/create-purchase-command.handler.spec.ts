import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { ProductOutOfStockException } from '../../exceptions/purchase.exceptions';
import { ProductRepository } from '../../repositories/product.repository';
import { PurchaseRepository } from '../../repositories/purchase.repository';
import { CreatePurchaseCommandHandler } from './create-purchase-command.handler';
import { CreatePurchaseCommand } from './create-purchase.command';
import { PurchaseCreatedEvent } from './events/purchase-created.event';

describe('CreatePurchaseCommandHandler', () => {

  let eventBus: EventBusMock;
  let handler: CreatePurchaseCommandHandler;
  let productRepository: ProductRepositoryMock;
  let purchaseRepository: PurchaseRepositoryMock;

  let command: CreatePurchaseCommand;

  beforeEach(async () => {
    productRepository = new ProductRepositoryMock();
    purchaseRepository = new PurchaseRepositoryMock();

    command = new CreatePurchaseCommand(
      "anyCompanyId",
      {
        deliveryAddress: {
          address: "address"
        } as any,
        products: [{
          amount: 10,
          productId: "anyProductId",
          stockOptionId: "anyStockOptionId"
        }],
        payment: {
          type: "anyPayment",
          receipt: "anyReceipt"
        }
      },
      { email: "any@email.com", id: "anyUserId" }
    );

    eventBus = new EventBusMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        CreatePurchaseCommandHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        ProductRepository,
        PurchaseRepository
      ]
    })
    .overrideProvider(EventBus).useValue(eventBus)
    .overrideProvider(ProductRepository).useValue(productRepository)
    .overrideProvider(PurchaseRepository).useValue(purchaseRepository)
    .compile();

    handler = module.get<CreatePurchaseCommandHandler>(CreatePurchaseCommandHandler);

    productRepository._response = {
      companyId: "anyCompanyId",
      id: "anyProductId",
      stock: {
        color: "anyColor",
        companyId: "anyCompanyId",
        id: "anyStockId",
        productId: "anyProductId",
        quantity: 10,
        size: "anySize"
      }
    };
  });

  it('given create purchase, then create new purchase', async () => {
    await handler.execute(command);

    expect(purchaseRepository._created).toBeTruthy();
  })

  it('given amount of products is higher then products on stock, then throw exception', async () => {
    productRepository._response.stock.quantity = 5;

    await expect(handler.execute(command)).rejects.toThrowError(ProductOutOfStockException);
  })

  it('given purchase created, then publish purchase created event', async () => {
    await handler.execute(command);

    expect(eventBus.published).toBeInstanceOf(PurchaseCreatedEvent);
  })

});

class ProductRepositoryMock {
  _response;

  findByIdWithStock() {
    return this._response;
  }
}

class PurchaseRepositoryMock {
  _created = false;

  create(params) {
    this._created = true;
  }
}