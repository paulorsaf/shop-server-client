import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { PurchasePriceService } from '../../../../services/purchase-price.service';
import { CalculatePurchasePriceQueryHandler } from './calculate-purchase-price-query.handler';
import { CalculatePurchasePriceQuery } from './calculate-purchase-price.query';

describe('CalculatePurchasePriceQueryHandler', () => {

  let handler: CalculatePurchasePriceQueryHandler;

  let purchasePriceService: PurchasePriceServiceMock;

  beforeEach(async () => {
    purchasePriceService = new PurchasePriceServiceMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        CalculatePurchasePriceQueryHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        PurchasePriceService
      ]
    })
    .overrideProvider(PurchasePriceService).useValue(purchasePriceService)
    .compile();

    handler = module.get<CalculatePurchasePriceQueryHandler>(CalculatePurchasePriceQueryHandler);
  });

  it('given calculate purchase price, then return price', async () => {
    const price = {id: "anyPrice"};
    purchasePriceService._response = price;

    const command = new CalculatePurchasePriceQuery({
      products: []
    } as any);

    const response = await handler.execute(command);

    expect(response).toEqual(price);
  })

});

class PurchasePriceServiceMock {
  _response;
  calculatePrice() {
    return this._response;
  }
}