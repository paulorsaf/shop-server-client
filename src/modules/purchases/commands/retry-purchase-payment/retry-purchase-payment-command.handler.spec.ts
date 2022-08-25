import { NotFoundException } from '@nestjs/common';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { PurchasePaymentRetriedEvent } from '../../events/purchase-payment-retried.event';
import { ProductOutOfStockException } from '../../exceptions/purchase.exceptions';
import { ProductRepository } from '../../repositories/product.repository';
import { PurchaseRepository } from '../../repositories/purchase.repository';
import { RetryPurchasePaymentCommandHandler } from './retry-purchase-payment-command.handler';
import { RetryPurchasePaymentCommand } from './retry-purchase-payment.command';

describe('RetryPurchasePaymentCommandHandler', () => {

  let eventBus: EventBusMock;
  let handler: RetryPurchasePaymentCommandHandler;
  let productRepository: ProductRepositoryMock;
  let purchaseRepository: PurchaseRepositoryMock;

  let command: RetryPurchasePaymentCommand;

  beforeEach(async () => {
    productRepository = new ProductRepositoryMock();
    purchaseRepository = new PurchaseRepositoryMock();

    command = new RetryPurchasePaymentCommand(
      "anyCompanyId",
      "anyPurchaseId",
      {
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
        RetryPurchasePaymentCommandHandler
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

    handler = module.get<RetryPurchasePaymentCommandHandler>(RetryPurchasePaymentCommandHandler);

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

  describe('given retry purchase payment', () => {

    describe('when purchase found', () => {
      
      beforeEach(() => {
        purchaseRepository._response = {
          id: "anyPurchaseId",
          payment: {
            error: "anyError",
            receiptUrl: "anyReceiptUrl",
            type: "anyType"
          }
        }
      })

      it('then update payment with new payment', async () => {
        await handler.execute(command);
    
        expect(purchaseRepository._isUpdated).toBeTruthy();
      })

      it('then update payment with new payment', async () => {
        await handler.execute(command);
    
        expect(purchaseRepository._isUpdatedWith.payment).toEqual({
          error: undefined,
          receiptUrl: undefined,
          type: "anyPayment"
        });
      })

      it('then publish purchase payment retried event', async () => {
        await handler.execute(command);
    
        expect(eventBus.published).toEqual(
          new PurchasePaymentRetriedEvent(
            "anyCompanyId",
            "anyPurchaseId",
            { receipt: "anyReceipt", type: "anyPayment" }
          )
        );
      })

    })

    it('when purchase not found, then throw not found exception', async () => {
      await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
    })

  })

});

class ProductRepositoryMock {
  _response;

  findByIdWithStock() {
    return this._response;
  }
}

class PurchaseRepositoryMock {
  _response;

  _isUpdated = false;
  _isUpdatedWith;

  findByIdAndCompanyId() {
    return this._response;
  }
  updatePayment(params) {
    this._isUpdatedWith = params;
    this._isUpdated = true;
  }
}