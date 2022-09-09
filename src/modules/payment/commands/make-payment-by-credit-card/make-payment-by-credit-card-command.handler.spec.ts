import { NotFoundException } from '@nestjs/common';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { PaymentByCreditCardCreatedEvent } from '../../events/payment-by-credit-card-created.event';
import { PaymentFailedEvent } from '../../events/payment-failed.event';
import { PaymentFactory } from '../../factories/payment.factory';
import { PurchaseRepository } from '../../repositories/purchase.repository';
import { MakePaymentByCreditCardCommandHandler } from './make-payment-by-credit-card-command.handler';
import { MakePaymentByCreditCardCommand } from './make-payment-by-credit-card.command';

describe('MakePaymentByCreditCardCommandHandler', () => {

  let eventBus: EventBusMock;
  let handler: MakePaymentByCreditCardCommandHandler;

  let command = new MakePaymentByCreditCardCommand(
    "anyCompanyId",
    "anyPurchaseId",
    {id: "anyBillingAddress"} as any,
    {id: "anyCreditCard"} as any
  );
  let paymentFactory: PaymentFactoryMock;
  let purchaseRepository: PurchaseRepositoryMock;

  beforeEach(async () => {
    eventBus = new EventBusMock();

    paymentFactory = new PaymentFactoryMock();
    purchaseRepository = new PurchaseRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        MakePaymentByCreditCardCommandHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        PaymentFactory,
        PurchaseRepository
      ]
    })
    .overrideProvider(EventBus).useValue(eventBus)
    .overrideProvider(PaymentFactory).useValue(paymentFactory)
    .overrideProvider(PurchaseRepository).useValue(purchaseRepository)
    .compile();

    handler = module.get<MakePaymentByCreditCardCommandHandler>(MakePaymentByCreditCardCommandHandler);
  });

  describe('given purchase found', () => {

    beforeEach(() => {
      purchaseRepository._response = {
        id: "anyPurchaseId",
        price: {id: "anyPrice"},
        user: {email: "any@email.com"}
      };
      paymentFactory._response = {id: "anyPaymentId"};
    })

    it('then make payment by credit card', async () => {
      await handler.execute(command);

      expect(paymentFactory._isPaid).toBeTruthy();
    })

    it('then update purchase payment details', async () => {
      await handler.execute(command);

      expect(purchaseRepository._isPaymentSaved).toBeTruthy();
    })

    it('when payment made, then publish payment by credit card created event', async () => {
      await handler.execute(command);

      expect(eventBus.published).toEqual(
        new PaymentByCreditCardCreatedEvent(
          "anyCompanyId",
          "anyPurchaseId",
          {id: "anyPaymentId"} as any
        )
      );
    })

    it('when error on payment, then publish payment failed event', async () => {
      paymentFactory._response = Promise.reject("anyError");

      await handler.execute(command);

      expect(eventBus.published).toEqual(
        new PaymentFailedEvent(
          "anyCompanyId",
          "anyPurchaseId",
          "anyError"
        )
      );
    })

  })

  it('given purchase not found, then throw not found exception', async () => {
    await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
  })

});

class PurchaseRepositoryMock {
  _response;

  _isPaymentSaved = false;

  findByIdAndCompany() {
    return this._response;
  }
  updatePaymentByCreditCard() {
    this._isPaymentSaved = true;
  }
}

class PaymentFactoryMock {
  _isPaid = false;
  _response;

  createPayment() {
    return {
      payByCreditCard: () => {
        this._isPaid = true;
        return this._response;
      }
    }
  }
}