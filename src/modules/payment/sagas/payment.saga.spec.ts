import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { PaymentSagas } from './payment.saga';
import { PaymentByPixSelectedEvent } from '../events/payment-by-pix-selected.event';
import { SavePaymentByPixCommand } from '../commands/save-payment-by-pix/save-payment-by-pix.command';
import { PaymentByPix } from '../model/payment/payment-by-pix.model';
import { PurchasePaymentByPix } from '../model/purchase/purchase-payment-by-pix.model';
import { PurchasePayment } from '../model/purchase/puchase-payment.model';
import { Payment } from '../model/payment/payment.model';
import { PaymentFailedEvent } from '../events/payment-failed.event';
import { SavePaymentErrorCommand } from '../commands/save-payment-error/save-payment-error.command';

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

  it('given purchase created, then execute save payment by pix command', done => {
    const event = new PaymentByPixSelectedEvent(
      purchasePayment
    );

    sagas.paymentByPixSelected(of(event)).subscribe(response => {
      expect(response).toEqual(
        new SavePaymentByPixCommand(
          new PurchasePaymentByPix({
            companyId: "anyCompanyId",
            purchaseId: "anyPurchaseId",
            payment: new PaymentByPix({
              receipt: "anyReceipt"
            }),
            userId: "anyUserId"
          })
        )
      );
      done();
    });
  });

  it('given payment failed, then execute save payment error command', done => {
    const event = new PaymentFailedEvent(
      "anyCompanyId",
      "anyPurchaseId",
      {error: "anyError"},
      "anyUserId"
    )

    sagas.paymentFailed(of(event)).subscribe(response => {
      expect(response).toEqual(
        new SavePaymentErrorCommand(
          "anyCompanyId",
          "anyPurchaseId",
          {error: "anyError"},
          "anyUserId"
        )
      );
      done();
    });
  });

});