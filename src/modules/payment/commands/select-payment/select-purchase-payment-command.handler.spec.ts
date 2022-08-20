import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { PaymentByPixSelectedEvent } from '../../events/payment-by-pix-selected.event';
import { Payment } from '../../model/payment/payment.model';
import { PurchasePayment } from '../../model/purchase/puchase-payment.model';
import { SelectPurchasePaymentCommandHandler } from './select-purchase-payment-command.handler';
import { SelectPurchasePaymentCommand } from './select-purchase-payment.command';

describe('SelectPurchasePaymentCommandHandler', () => {

  let eventBus: EventBusMock;
  let handler: SelectPurchasePaymentCommandHandler;

  let command: SelectPurchasePaymentCommand;

  beforeEach(async () => {
    eventBus = new EventBusMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        SelectPurchasePaymentCommandHandler
      ],
      imports: [
        CqrsModule
      ]
    })
    .overrideProvider(EventBus).useValue(eventBus)
    .compile();

    handler = module.get<SelectPurchasePaymentCommandHandler>(SelectPurchasePaymentCommandHandler);
  });

  it('given create payment, when payment by money, then dont publish any event', async () => {
    const purchasePayment = createPurchasePayment("MONEY");

    command = new SelectPurchasePaymentCommand(
      purchasePayment
    );

    await handler.execute(command);

    expect(eventBus.published).toBeUndefined();
  })

  it('given create payment, when payment by pix, then publish payment by pix selected event', async () => {
    const purchasePayment = createPurchasePayment("PIX");
    command = new SelectPurchasePaymentCommand(
      purchasePayment
    );

    await handler.execute(command);

    expect(eventBus.published).toEqual(
      new PaymentByPixSelectedEvent(
        purchasePayment
      )
    );
  })

  function createPurchasePayment(type: string) {
    return new PurchasePayment({
      companyId: "anyCompanyId",
      id: "anyPurchaseId",
      payment: new Payment({
        type
      }),
      userId: "anyUserId"
    });
  }

});