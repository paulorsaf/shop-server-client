import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { ProductsPurchasedDecreasedStockEvent } from '../commands/decrease-amount-on-stock-options/events/products-purchases-decreased-stock.event';
import { Product } from '../commands/update-product-stock-list/model/product.model';
import { UpdateProductStockListCommand } from '../commands/update-product-stock-list/update-product-stock-list.command';
import { StockSagas } from './stock.saga';

describe('StockSagas', () => {

  let sagas: StockSagas;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        StockSagas
      ],
      imports: [
        CqrsModule
      ]
    })
    .compile();

    sagas = module.get<StockSagas>(StockSagas);
  });

  it('given products purchased decrease stock, then update product stock list', done => {
    const event = new ProductsPurchasedDecreasedStockEvent(
      "anyCompanyId", "anyPurchaseId", [
        { amount: 10, productId: "anyProductId", stockId: "anyStockId" }
      ], "anyUserId"
    );

    sagas.productsPurchasesStockDecreased(of(event)).subscribe(response => {
      expect(response).toEqual(
        new UpdateProductStockListCommand(
          "anyCompanyId", "anyPurchaseId", [
            new Product({productId: "anyProductId"})
          ], "anyUserId"
        )
      );
      done();
    });
  });

});
