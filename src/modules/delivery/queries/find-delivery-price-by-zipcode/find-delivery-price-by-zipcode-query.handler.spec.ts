import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { ZipCodeNotFoundException } from '../../exceptions/zipcode-not-found.exception';
import { AddressRepository } from '../../repositories/address.repository';
import { DeliveryRepository } from '../../repositories/delivery.repository';
import { FindDeliveryPriceByZipCodeQueryHandler } from './find-delivery-price-by-zipcode-query.handler';

describe('FindDeliveryPriceByZipCodeQueryHandler', () => {

  let handler: FindDeliveryPriceByZipCodeQueryHandler;

  let query;
  let addressRepository: AddressRepositoryMock;
  let deliveryRepository: DeliveryRepositoryMock;

  beforeEach(async () => {
    addressRepository = new AddressRepositoryMock();
    deliveryRepository = new DeliveryRepositoryMock();
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
        AddressRepository,
        DeliveryRepository
      ]
    })
    .overrideProvider(AddressRepository).useValue(addressRepository)
    .overrideProvider(DeliveryRepository).useValue(deliveryRepository)
    .compile();

    handler = module.get<FindDeliveryPriceByZipCodeQueryHandler>(FindDeliveryPriceByZipCodeQueryHandler);
  });

  describe('given address found by zipcode', () => {

    it('when company is in the same city, then return city delivery value', async () => {
      addressRepository._response = {city: "anyCity"};

      const response = await handler.execute(query);
  
      expect(response).toEqual(10);
    });

    describe('when company is in a different city', () => {

      beforeEach(() => {
        addressRepository._response = {city: "anyOtherCity"};
        deliveryRepository._response = 100;
      })

      it('and products have weight, then calculate delivery price with total weight', async () => {
        await handler.execute(query);
    
        expect(deliveryRepository._calledWith.totalWeight).toEqual(6);
      });

      it('and no products defined, then calculate delivery price weight of 1kg', async () => {
        query.products = [];

        await handler.execute(query);
    
        expect(deliveryRepository._calledWith.totalWeight).toEqual(1);
      });

      it('and products dont have weight defined, then calculate delivery price weight of 1kg', async () => {
        query.products[0].weight = undefined;

        await handler.execute(query);
    
        expect(deliveryRepository._calledWith.totalWeight).toEqual(1);
      });

      it('then return mail delivery price', async () => {
        const response = await handler.execute(query);
    
        expect(response).toEqual(100);
      });

    })

  });

  describe('given address not found by zipcode', () => {

    it('then throw not found error', async () => {
      await expect(handler.execute(query)).rejects.toThrowError(ZipCodeNotFoundException);
    });

  });

  describe('given error on find address by zipcode', () => {

    it('then throw not found error', async () => {
      addressRepository._response = Promise.reject({});

      await expect(handler.execute(query)).rejects.toThrowError(ZipCodeNotFoundException);
    });

  });

});

class AddressRepositoryMock {
  _response;
  findByZipCode() {
    return this._response;
  }
}

class DeliveryRepositoryMock {
  _calledWith;
  _response;
  findDeliveryPrice(params) {
    this._calledWith = params;
    return this._response;
  }
}