import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { DeliveryService } from '../../../../services/delivery.service';
import { ZipCodeNotFoundException } from '../../exceptions/zipcode-not-found.exception';
import { FindDeliveryPriceByZipCodeQueryHandler } from './find-delivery-price-by-zipcode-query.handler';

describe('FindDeliveryPriceByZipCodeQueryHandler', () => {

  let handler: FindDeliveryPriceByZipCodeQueryHandler;

  let query;
  let deliveryService: DeliveryServiceMock;

  beforeEach(async () => {
    deliveryService = new DeliveryServiceMock();

    query = {
      company: {address: {city: "anyCity"} as any, cityDeliveryPrice: 10},
      zipCode: 'anyZipCode',
      products: [{amount: 2, weight: 3}]
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        FindDeliveryPriceByZipCodeQueryHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        DeliveryService
      ]
    })
    .overrideProvider(DeliveryService).useValue(deliveryService)
    .compile();

    handler = module.get<FindDeliveryPriceByZipCodeQueryHandler>(FindDeliveryPriceByZipCodeQueryHandler);
  });

  describe('given find delivery price by zip code', () => {

    it('when success, then return delivery price', async () => {
      deliveryService._response = Promise.resolve(10);
      
      const price = await handler.execute(query);

      expect(price).toEqual(10);
    });

    it('when fail, then throw zip code not found exception', async () => {
      deliveryService._response = Promise.reject({});

      await expect(handler.execute(query)).rejects.toThrowError(ZipCodeNotFoundException);
    });

  });

});

class DeliveryServiceMock {
  _calledWith;
  _response;
  calculateDelivery(params) {
    this._calledWith = params;
    return this._response;
  }
}