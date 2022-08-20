import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { PaymentByPixSavedEvent } from '../../events/payment-by-pix-saved.event';
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

  it('given save payment by pix, then save payment', async () => {
    await handler.execute(command);

    expect(paymentByPix._isPaymentSaved).toBeTruthy();
  })

  it('given purchase saved, then publish payment by pix saved event', async () => {
    paymentByPix._responseSavePayment = Promise.resolve("anyReceiptUrl")

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

  // describe('given error', () => {

  //   it('then update purchase', async () => {
  //     // add error to payment
  //     // update status to verifying payment
  //     expect(false).toBeTruthy();
  //   })

  //   it('then publish save payment by pix failed event', async () => {
  //     expect(false).toBeTruthy();
  //   })

  // })

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