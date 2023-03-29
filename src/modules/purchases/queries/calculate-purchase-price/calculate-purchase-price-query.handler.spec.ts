import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { CupomRepository } from '../../repositories/cupom.repository';
import { CalculatePurchasePriceQueryHandler } from './calculate-purchase-price-query.handler';
import { CalculatePurchasePriceQuery } from './calculate-purchase-price.query';

describe('CalculatePurchasePriceQueryHandler', () => {

  let handler: CalculatePurchasePriceQueryHandler;

  let cupomRepository: CupomRepositoryMock;

  beforeEach(async () => {
    cupomRepository = new CupomRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        CalculatePurchasePriceQueryHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        CupomRepository
      ]
    })
    .overrideProvider(CupomRepository).useValue(cupomRepository)
    .compile();

    handler = module.get<CalculatePurchasePriceQueryHandler>(CalculatePurchasePriceQueryHandler);
  });

  it('given calculate purchase price, then return price', async () => {
    const price = {id: "anyPrice"};
    cupomRepository._response = price;

    const command = new CalculatePurchasePriceQuery({
      company: {},
      products: []
    } as any);

    const response = await handler.execute(command);

    expect(response).toEqual({
      deliveryPrice: 0,
      discount: 0,
      paymentFee: 0,
      productsPrice: 0,
      serviceFee: 0,
      totalPrice: 0,
      totalWithPaymentFee: 0
    });
  })

});

class CupomRepositoryMock {
  _response;
  find() {
    return this._response;
  }
}