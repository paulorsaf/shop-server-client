import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { DecreaseStockOptionsOnPurchaseCommand } from '../../stocks/commands/decrease-amount-on-stock-options/decrease-stock-options-on-purchase.command';
import { PurchaseCreatedEvent } from '../commands/create-purchase/events/purchase-created.event';
import { PurchaseSagas } from './purchases.saga';
import { SelectPurchasePaymentCommand } from '../../payment/commands/select-payment/select-purchase-payment.command';
import { Purchase } from '../model/purchase.model';
import { PurchasePaymentRetriedEvent } from '../events/purchase-payment-retried.event';
import { SendNewPurchaseEmailToCompanyCommand } from '../../email/commands/send-new-purchase-email-to-company/send-new-purchase-email-to-company.command';
import { SendNewPurchaseEmailToClientCommand } from '../../email/commands/send-new-purchase-email-to-client/send-new-purchase-email-to-client.command';

describe('PurchaseSagas', () => {

  let sagas: PurchaseSagas;
  
  let event: PurchaseCreatedEvent;

  beforeEach(async () => {
    event = new PurchaseCreatedEvent(
      "anyCompanyId",
      "anyPurchaseId",
      new Purchase({
        companyId: "anyCompanyId",
        products: [{
          companyId: "anyCompanyId",
          id: "anyProductId",
          amount: 10,
          stock: {
            id: "anyStockId",
            quantity: 10
          }
        } as any],
        user: {
          email: "any@email.com",
          id: "anyUserId"
        }
      }),
      {
        type: "ANY TYPE",
        receipt: "anyReceipt"
      },
      "anyUserId"
    );

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        PurchaseSagas
      ],
      imports: [
        CqrsModule
      ]
    })
    .compile();

    sagas = module.get<PurchaseSagas>(PurchaseSagas);
  });

  describe('given purchase created', () => {

    it('then publish decrease amount on stock options', done => {
      sagas.purchaseCreatedDecreaseStock(of(event)).subscribe(response => {
        expect(response).toEqual(
          new DecreaseStockOptionsOnPurchaseCommand(
            "anyCompanyId",
            "anyPurchaseId",
            [{
              amount: 10,
              productId: "anyProductId",
              stock: {
                id: "anyStockId",
                quantity: 10
              }
            }],
            "anyUserId"
          )
        );
        done();
      });
    });
  
    it('then execute select purchase payment command', done => {
      sagas.purchaseCreatedMakePayment(of(event)).subscribe(response => {
        expect(response).toEqual(
          new SelectPurchasePaymentCommand(
            "anyCompanyId",
            "anyPurchaseId",
            "anyReceipt"
          )
        );
        done();
      });
    });
  
    it('then execute send new purchase email to company command', done => {
      sagas.purchaseCreatedSendEmailToCompany(of(event)).subscribe(response => {
        expect(response).toEqual(
          new SendNewPurchaseEmailToCompanyCommand(
            "anyCompanyId",
            "anyPurchaseId"
          )
        );
        done();
      });
    });
  
    it('then execute send new purchase email to client command', done => {
      sagas.purchaseCreatedSendEmailToClient(of(event)).subscribe(response => {
        expect(response).toEqual(
          new SendNewPurchaseEmailToClientCommand(
            "anyCompanyId",
            "anyPurchaseId"
          )
        );
        done();
      });
    });

  })

  it('given purchase payment retried, then execute select purchase payment command', done => {
    const event = new PurchasePaymentRetriedEvent(
      "anyCompanyId",
      "anyPurchaseId",
      { type: "anyType", receipt: "anyReceipt" }
    );

    sagas.purchasePaymentRetriedMakePayment(of(event)).subscribe(response => {
      expect(response).toEqual(
        new SelectPurchasePaymentCommand(
          "anyCompanyId",
          "anyPurchaseId",
          "anyReceipt"
        )
      );
      done();
    });
  });

});