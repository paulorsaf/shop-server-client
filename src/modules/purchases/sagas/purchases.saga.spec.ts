import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { Product } from '../../stocks/commands/decrease-amount-on-stock-options/model/product.model';
import { DecreaseStockOptionsOnPurchaseCommand } from '../../stocks/commands/decrease-amount-on-stock-options/decrease-stock-options-on-purchase.command';
import { PurchaseCreatedEvent } from '../commands/create-purchase/events/purchase-created.event';
import { PurchaseSagas } from './purchases.saga';
import { Stock } from '../../stocks/commands/decrease-amount-on-stock-options/model/stock.model';

describe('PurchaseSagas', () => {

  let sagas: PurchaseSagas;

  beforeEach(async () => {
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
    const purchase = {
      getId: () => "anyPurchaseId",
      getProducts: () => [{
        getId: () => "anyProductId",
        getStock: () => ({
          getId: () => "andStockId",
          getQuantity: () => 10
        }),
        getAmount: () => 10
      }]
    } as any;
    
    const event = new PurchaseCreatedEvent(
      "anyCompanyId", purchase, "anyUserId"
    );

    sagas.purchaseCreated(of(event)).subscribe(response => {
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

});
