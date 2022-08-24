import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { Product } from '../../stocks/commands/decrease-amount-on-stock-options/model/product.model';
import { DecreaseStockOptionsOnPurchaseCommand } from '../../stocks/commands/decrease-amount-on-stock-options/decrease-stock-options-on-purchase.command';
import { PurchaseCreatedEvent } from '../commands/create-purchase/events/purchase-created.event';
import { PurchaseSagas } from './purchases.saga';
import { Stock } from '../../stocks/commands/decrease-amount-on-stock-options/model/stock.model';
import { SelectPurchasePaymentCommand } from '../../payment/commands/select-payment/select-purchase-payment.command';
import { CreatePurchase } from '../model/create-purchase.model';
import { CreatePurchaseProduct } from '../model/create-purchase-product.model';
import { CreatePurchaseProductStock } from '../model/create-purchase-product-stock.model';

describe('PurchaseSagas', () => {

  let sagas: PurchaseSagas;
  
  let event: PurchaseCreatedEvent;

  beforeEach(async () => {
    event = new PurchaseCreatedEvent(
      "anyCompanyId",
      "anyPurchaseId",
      new CreatePurchase({
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

  it('given purchase created, then publish decrease amount on stock options', done => {
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

  it('given purchase created, then execute select purchase payment command', done => {
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