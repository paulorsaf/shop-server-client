import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseRepository } from '../../repositories/purchase.repository';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { PaymentByPixSelectedEvent } from '../../events/payment-by-pix-selected.event';
import { SelectPurchasePaymentCommandHandler } from './select-purchase-payment-command.handler';
import { SelectPurchasePaymentCommand } from './select-purchase-payment.command';
import { PaymentByCreditCardSelectedEvent } from '../../events/payment-by-credit-card-selected.event';
import { Purchase } from '../../model/purchase.model';
import { PaymentBySavedCreditCardSelectedEvent } from '../../events/payment-by-saved-credit-card-selected.event';

describe('SelectPurchasePaymentCommandHandler', () => {

  let eventBus: EventBusMock;
  let handler: SelectPurchasePaymentCommandHandler;

  const payment = {receipt: "anyReceipt"} as any;
  let command = new SelectPurchasePaymentCommand(
    "anyCompanyId",
    "anyPurchaseId",
    payment
  );
  let purchaseRepository: PurchaseRepositoryMock;

  beforeEach(async () => {
    eventBus = new EventBusMock();
    purchaseRepository = new PurchaseRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        SelectPurchasePaymentCommandHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        PurchaseRepository
      ]
    })
    .overrideProvider(EventBus).useValue(eventBus)
    .overrideProvider(PurchaseRepository).useValue(purchaseRepository)
    .compile();

    handler = module.get<SelectPurchasePaymentCommandHandler>(SelectPurchasePaymentCommandHandler);
  });

  describe('given create payment', () => {

    it('when payment by money, then dont publish any event', async () => {
      const purchase = new Purchase({
        payment: {
          type: "MONEY"
        } as any
      });
      purchaseRepository._response = Promise.resolve(purchase);
  
      await handler.execute(command);
  
      expect(eventBus.published).toBeUndefined();
    })
  
    it('when payment by pix, then publish payment by pix selected event', async () => {
      const purchase = new Purchase({
        payment: {
          type: "PIX"
        } as any
      });
      purchaseRepository._response = Promise.resolve(purchase);
  
      await handler.execute(command);
  
      expect(eventBus.published).toEqual(
        new PaymentByPixSelectedEvent(
          "anyCompanyId",
          "anyPurchaseId",
          "anyReceipt"
        )
      );
    })
  
    it('when payment by new credit card, then publish payment by credit card selected event', async () => {
      const purchase = new Purchase({
        payment: {
          type: "CREDIT_CARD"
        } as any
      });
      purchaseRepository._response = Promise.resolve(purchase);
  
      await handler.execute(command);
  
      expect(eventBus.published).toEqual(
        new PaymentByCreditCardSelectedEvent(
          "anyCompanyId",
          "anyPurchaseId",
          command.payment.billingAddress,
          command.payment.creditCard
        )
      );
    })
  
    it('when payment by saved credit card, then publish payment by saved credit card selected event', async () => {
      payment.creditCardId = "anyCreditCardId";

      const purchase = new Purchase({
        payment: {
          type: "CREDIT_CARD"
        } as any
      });
      purchaseRepository._response = Promise.resolve(purchase);
  
      await handler.execute(command);
  
      expect(eventBus.published).toEqual(
        new PaymentBySavedCreditCardSelectedEvent(
          "anyCompanyId",
          "anyPurchaseId",
          "anyCreditCardId"
        )
      );
    })

  })

});

class PurchaseRepositoryMock {
  _response;

  findByIdAndCompany() {
    return this._response;
  }
}