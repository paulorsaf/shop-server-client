import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { ProductOutOfStockException } from '../../exceptions/purchase.exceptions';
import { ProductRepository } from '../../repositories/product.repository';
import { PurchaseRepository } from '../../repositories/purchase.repository';
import { CreatePurchaseCommandHandler } from './create-purchase-command.handler';
import { CreatePurchaseCommand } from './create-purchase.command';
import { PurchaseCreatedEvent } from './events/purchase-created.event';
import { CupomRepository } from '../../repositories/cupom.repository';

describe('CreatePurchaseCommandHandler', () => {

  let eventBus: EventBusMock;
  let handler: CreatePurchaseCommandHandler;
  let cupomRepository: CupomRepositoryMock;
  let productRepository: ProductRepositoryMock;
  let purchaseRepository: PurchaseRepositoryMock;

  let command: CreatePurchaseCommand;

  beforeEach(async () => {
    cupomRepository = new CupomRepositoryMock();
    productRepository = new ProductRepositoryMock();
    purchaseRepository = new PurchaseRepositoryMock();

    command = new CreatePurchaseCommand(
      {
        cityDeliveryPrice: 10,
        companyCity: "anyCity",
        hasDeliveryByMail: true,
        id: "anyCompanyId",
        payment: {id: "anyPayment"} as any,
        zipCode: "anyZipCode",
        serviceTax: 10
      },
      {
        deliveryAddress: {
          address: "address"
        } as any,
        deliveryPrice: 10,
        products: [{
          amount: 10,
          productId: "anyProductId",
          stockOptionId: "anyStockOptionId"
        }],
        payment: {
          cupom: "anyCupom",
          receipt: "anyReceipt",
          type: "anyPayment"
        },
        productNotes: [{id: "anyId"} as any]
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
        CupomRepository,
        ProductRepository,
        PurchaseRepository
      ]
    })
    .overrideProvider(EventBus).useValue(eventBus)
    .overrideProvider(CupomRepository).useValue(cupomRepository)
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

  create() {
    this._created = true;
  }
}

class CupomRepositoryMock {
  find() {
    return 10;
  }
}