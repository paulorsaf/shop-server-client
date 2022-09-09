import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { PaymentSagas } from './payment.saga';
import { PaymentByPixSelectedEvent } from '../events/payment-by-pix-selected.event';
import { SavePaymentByPixCommand } from '../commands/save-payment-by-pix/save-payment-by-pix.command';
import { PurchasePayment } from '../model/purchase/puchase-payment.model';
import { Payment } from '../model/payment/payment.model';
import { PaymentFailedEvent } from '../events/payment-failed.event';
import { SavePaymentErrorCommand } from '../commands/save-payment-error/save-payment-error.command';
import { PaymentByCreditCardSelectedEvent } from '../events/payment-by-credit-card-selected.event';
import { MakePaymentByCreditCardCommand } from '../commands/make-payment-by-credit-card/make-payment-by-credit-card.command';
import { PaymentByCreditCardCreatedEvent } from '../events/payment-by-credit-card-created.event';
import { SendPaymentSuccessEmailToClientCommand } from '../../email/commands/send-payment-success-email-to-client/send-payment-success-email-to-client.command';

describe('PaymentSagas', () => {

  let sagas: PaymentSagas;
  
  let purchasePayment: PurchasePayment;

  beforeEach(async () => {
    purchasePayment = new PurchasePayment({
      companyId: "anyCompanyId",
      id: "anyPurchaseId",
      payment: new Payment({
        type: "PIX",
        receipt: "anyReceipt"
      }),
      userId: "anyUserId"
    })

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        PaymentSagas
      ],
      imports: [
        CqrsModule
      ]
    })
    .compile();

    sagas = module.get<PaymentSagas>(PaymentSagas);
  });

  it('given payment by pix selected, then execute save payment by pix command', done => {
    const event = new PaymentByPixSelectedEvent(
      "anyCompanyId",
      "anyPurchaseId",
      "anyReceipt"
    );

    sagas.paymentByPixSelected(of(event)).subscribe(response => {
      expect(response).toEqual(
        new SavePaymentByPixCommand(
          "anyCompanyId",
          "anyPurchaseId",
          "anyReceipt"
        )
      );
      done();
    });
  });

  it('given payment by credit card selected, then execute make payment by credit card command', done => {
    const billingAddress = {id: "anyBillingAddress"} as any;
    const creditCard = {id: "anyCreditCard"} as any;

    const event = new PaymentByCreditCardSelectedEvent(
      "anyCompanyId",
      "anyPurchaseId",
      billingAddress,
      creditCard
    );

    sagas.paymentByCreditCardSelected(of(event)).subscribe(response => {
      expect(response).toEqual(
        new MakePaymentByCreditCardCommand(
          "anyCompanyId",
          "anyPurchaseId",
          billingAddress,
          creditCard
        )
      );
      done();
    });
  });

  it('given payment failed, then execute save payment error command', done => {
    const event = new PaymentFailedEvent(
      "anyCompanyId",
      "anyPurchaseId",
      {error: "anyError"}
    )

    sagas.paymentFailed(of(event)).subscribe(response => {
      expect(response).toEqual(
        new SavePaymentErrorCommand(
          "anyCompanyId",
          "anyPurchaseId",
          {error: "anyError"}
        )
      );
      done();
    });
  });

  it('given payment by credit card created, then execute send email client payment succeeded command', done => {
    const payment = {id: "anyPayment"} as any;

    const event = new PaymentByCreditCardCreatedEvent(
      "anyCompanyId",
      "anyPurchaseId",
      payment
    );

    sagas.paymentByCreditCardCreated(of(event)).subscribe(response => {
      expect(response).toEqual(
        new SendPaymentSuccessEmailToClientCommand(
          "anyCompanyId",
          "anyPurchaseId"
        )
      );
      done();
    });
  });

});