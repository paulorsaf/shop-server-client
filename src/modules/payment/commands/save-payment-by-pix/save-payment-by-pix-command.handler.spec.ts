import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { PaymentByPixSavedEvent } from '../../events/payment-by-pix-saved.event';
import { PaymentFailedEvent } from '../../events/payment-failed.event';
import { SavePaymentByPixCommandHandler } from './save-payment-by-pix-command.handler';
import { SavePaymentByPixCommand } from './save-payment-by-pix.command';

describe('SavePaymentByPixCommandHandler', () => {

  let eventBus: EventBusMock;
  let handler: SavePaymentByPixCommandHandler;

  let command: SavePaymentByPixCommand;
  let paymentByPix: PaymentByPixMock;

  beforeEach(async () => {
    eventBus = new EventBusMock();
    paymentByPix = new PaymentByPixMock();

    command = new SavePaymentByPixCommand(paymentByPix as any);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        SavePaymentByPixCommandHandler
      ],
      imports: [
        CqrsModule
      ]
    })
    .overrideProvider(EventBus).useValue(eventBus)
    .compile();

    handler = module.get<SavePaymentByPixCommandHandler>(SavePaymentByPixCommandHandler);
  });

  describe('given save payment by pix', () => {

    beforeEach(() => {
      paymentByPix._responseSavePayment = Promise.resolve("anyReceiptUrl")
    })

    it('then save payment by pix', async () => {
      await handler.execute(command);
  
      expect(paymentByPix._isPaymentSaved).toBeTruthy();
    })
  
    it('when payment saved, then publish payment by pix saved event', async () => {
      await handler.execute(command);
  
      expect(eventBus.published).toEqual(
        new PaymentByPixSavedEvent(
          "anyCompanyId",
          "anyPurchaseId", 
          "anyReceiptUrl",
          "anyUserId"
        )
      );
    })

  })

  describe('given save payment by pix failed', () => {

    beforeEach(() => {
      paymentByPix._responseSavePayment = Promise.reject({error: "anyError"});
    })

    it('then publish payment failed event', async () => {
      await handler.execute(command);

      expect(eventBus.published).toEqual(
        new PaymentFailedEvent(
          "anyCompanyId",
          "anyPurchaseId",
          {error: "anyError"},
          "anyUserId"
        )
      );
    })

  })

});

class PaymentByPixMock {
  companyId = "anyCompanyId";
  purchaseId = "anyPurchaseId";
  payment = {
    receiptUrl: "anyReceipt"
  };
  userId = "anyUserId"

  _isPaymentSaved = false;
  _responseSavePayment;

  savePayment() {
    this._isPaymentSaved = true;
    return this._responseSavePayment;
  }
}