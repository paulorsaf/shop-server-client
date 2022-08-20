import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { Product } from '../../stocks/commands/decrease-amount-on-stock-options/model/product.model';
import { DecreaseStockOptionsOnPurchaseCommand } from '../../stocks/commands/decrease-amount-on-stock-options/decrease-stock-options-on-purchase.command';
import { PurchaseCreatedEvent } from '../commands/create-purchase/events/purchase-created.event';
import { PurchaseSagas } from './purchases.saga';
import { Stock } from '../../stocks/commands/decrease-amount-on-stock-options/model/stock.model';
import { PurchasePayment } from '../../payment/model/purchase/puchase-payment.model';
import { Payment } from '../../payment/model/payment/payment.model';
import { SelectPurchasePaymentCommand } from '../../payment/commands/select-payment/select-purchase-payment.command';

describe('PurchaseSagas', () => {

  let sagas: PurchaseSagas;
  
  let event: PurchaseCreatedEvent;

  beforeEach(async () => {
    event = new PurchaseCreatedEvent(
      "anyCompanyId",
      "anyPurchaseId",
      new PurchaseMock() as any, {
        receipt: "anyReceipt",
        type: "anyType"
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

  it('given purchase created, then publish decrease amount on stock options', done => {
    sagas.purchaseCreatedDecreaseStock(of(event)).subscribe(response => {
      expect(response).toEqual(
        new DecreaseStockOptionsOnPurchaseCommand(
          "anyCompanyId",
          "anyPurchaseId",
          [
            new Product({
              productId: "anyProductId", amount: 10, stock: new Stock({} as any)
            })
          ],
          "anyUserId"
        )
      );
      done();
    });
  });

  it('given purchase created, then execute select purchase payment command', done => {
    sagas.purchaseCreatedMakePayment(of(event)).subscribe(response => {
      expect(response).toEqual(
        new SelectPurchasePaymentCommand(
          new PurchasePayment({
            companyId: "anyCompanyId",
            id: "anyPurchaseId",
            payment: new Payment({
              receipt: "anyReceipt",
              type: "anyType"
            }),
            userId: "anyUserId"
          })
        )
      );
      done();
    });
  });

});

class PurchaseMock {
  getId(){ return "anyPurchaseId" }
  getProducts(){
    return [{
      getId: () => "anyProductId",
      getStock: () => ({
        getId: () => "andStockId",
        getQuantity: () => 10
      }),
      getAmount: () => 10
    }]
  }
}