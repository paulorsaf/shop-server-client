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
import { PaymentBySavedCreditCardSelectedEvent } from '../events/payment-by-saved-credit-card-selected.event';
import { MakePaymentBySavedCreditCardCommand } from '../commands/make-payment-by-saved-credit-card/make-payment-by-saved-credit-card.command';
import { SetPurchaseSummaryPaymentErrorCommand } from '../../purchase-summaries/commands/set-purchase-summary-payment-error/set-purchase-summary-payment-error.command';
import { SetPurchaseSummaryPaymentSuccessCommand } from '../../purchase-summaries/commands/set-purchase-summary-payment-success/set-purchase-summary-payment-success.command';
import { PaymentByPixSavedEvent } from '../events/payment-by-pix-saved.event';
import { PaymentByMoneySelectedEvent } from '../events/payment-by-money-selected.event';
import { SavePaymentByMoneyCommand } from '../commands/save-payment-by-money/save-payment-by-money.command';

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

  it('given payment by money selected, then execute save payment by pix command', done => {
    const event = new PaymentByMoneySelectedEvent(
      "anyCompanyId",
      "anyPurchaseId",
      10
    );

    sagas.paymentByMoneySelected(of(event)).subscribe(response => {
      expect(response).toEqual(
        new SavePaymentByMoneyCommand(
          "anyCompanyId",
          "anyPurchaseId",
          10
        )
      );
      done();
    });
  });

  it('given payment by saved credit card selected, then execute make payment by saved credit card command', done => {
    const event = new PaymentBySavedCreditCardSelectedEvent(
      "anyCompanyId",
      "anyPurchaseId",
      "anyCreditCardId"
    );

    sagas.paymentBySavedCreditCardSelected(of(event)).subscribe(response => {
      expect(response).toEqual(
        new MakePaymentBySavedCreditCardCommand(
          "anyCompanyId",
          "anyPurchaseId",
          "anyCreditCardId"
        )
      );
      done();
    });
  });

  describe('given payment failed', () => {

    const event = new PaymentFailedEvent(
      "anyCompanyId",
      "anyPurchaseId",
      {error: "anyError"}
    )

    it('then execute save payment error command', done => {
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
    
    it('then execute set purchase summary payment error command', done => {
      sagas.paymentFailedUpdatePurchaseSummary(of(event)).subscribe(response => {
        expect(response).toEqual(
          new SetPurchaseSummaryPaymentErrorCommand(
            "anyCompanyId",
            "anyPurchaseId",
            {error: "anyError"}
          )
        );
        done();
      });
    });
    
  })

  describe('given payment by credit card created', () => {

    const payment = {id: "anyPayment"} as any;
    const event = new PaymentByCreditCardCreatedEvent(
      "anyCompanyId",
      "anyPurchaseId",
      payment
    );

    it('then execute send email client payment succeeded command', done => {
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

    it('then execute set purchase summary payment success command', done => {
      sagas.paymentByCreditCardCreatedUpdatePurchaseSummary(of(event)).subscribe(response => {
        expect(response).toEqual(
          new SetPurchaseSummaryPaymentSuccessCommand(
            "anyCompanyId",
            "anyPurchaseId"
          )
        );
        done();
      });
    });

  })

  describe('given payment by pix saved', () => {

    const event = new PaymentByPixSavedEvent(
      "anyCompanyId",
      "anyPurchaseId",
      "anyReceiptUrl",
      "anyUserId"
    );

    it('then execute set purchase summary payment success command', done => {
      sagas.paymentByPixSavedUpdatePurchaseSummary(of(event)).subscribe(response => {
        expect(response).toEqual(
          new SetPurchaseSummaryPaymentSuccessCommand(
            "anyCompanyId",
            "anyPurchaseId"
          )
        );
        done();
      });
    });

  })

});