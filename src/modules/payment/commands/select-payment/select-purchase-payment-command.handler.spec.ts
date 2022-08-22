import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseRepository } from '../../repositories/purchase.repository';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { PaymentByPixSelectedEvent } from '../../events/payment-by-pix-selected.event';
import { SelectPurchasePaymentCommandHandler } from './select-purchase-payment-command.handler';
import { SelectPurchasePaymentCommand } from './select-purchase-payment.command';

describe('SelectPurchasePaymentCommandHandler', () => {

  let eventBus: EventBusMock;
  let handler: SelectPurchasePaymentCommandHandler;

  let command = new SelectPurchasePaymentCommand(
    "anyCompanyId",
    "anyPurchaseId",
    "anyReceipt"
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

  it('given create payment, when payment by money, then dont publish any event', async () => {
    const purchase = new PurchaseMock();
    purchase.payment.type = "MONEY";
    purchaseRepository._response = Promise.resolve(purchase);

    await handler.execute(command);

    expect(eventBus.published).toBeUndefined();
  })

  it('given create payment, when payment by pix, then publish payment by pix selected event', async () => {
    const purchase = new PurchaseMock();
    purchase.payment.type = "PIX";
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

});

class PurchaseRepositoryMock {
  _response;

  findByIdAndCompany() {
    return this._response;
  }
}

class PurchaseMock {
  payment = {
    type: ""
  }
}