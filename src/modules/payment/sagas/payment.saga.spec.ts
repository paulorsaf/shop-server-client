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

describe('PaymentSagas', () => {

  let sagas: PaymentSagas;
  
  let event: PaymentByPixSelectedEvent;
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
    event = new PaymentByPixSelectedEvent(purchasePayment);

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

});