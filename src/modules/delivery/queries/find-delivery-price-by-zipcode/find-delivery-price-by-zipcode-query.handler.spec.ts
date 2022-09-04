import { NotFoundException } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { ZipCodeNotFoundException } from '../../exceptions/zipcode-not-found.exception';
import { AddressRepository } from '../../repositories/address.repository';
import { DeliveryRepository } from '../../repositories/delivery.repository';
import { FindDeliveryPriceByZipCodeQueryHandler } from './find-delivery-price-by-zipcode-query.handler';
import { FindDeliveryPriceByZipCodeQuery } from './find-delivery-price-by-zipcode.query';

describe('FindDeliveryPriceByZipCodeQueryHandler', () => {

  let handler: FindDeliveryPriceByZipCodeQueryHandler;

  let command = new FindDeliveryPriceByZipCodeQuery(
    {address: {city: "anyCity"} as any, cityDeliveryPrice: 10},
    'anyZipCode'
  );
  let addressRepository: AddressRepositoryMock;
  let deliveryRepository: DeliveryRepositoryMock;

  beforeEach(async () => {
    addressRepository = new AddressRepositoryMock();
    deliveryRepository = new DeliveryRepositoryMock();

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

      const response = await handler.execute(command);
  
      expect(response).toEqual(10);
    });

    it('when company is in a different city, then return mail delivery price', async () => {
      addressRepository._response = {city: "anyOtherCity"};
      deliveryRepository._response = 100;

      const response = await handler.execute(command);
  
      expect(response).toEqual(100);
    });

  });

  describe('given address not found by zipcode', () => {

    it('then throw not found error', async () => {
      await expect(handler.execute(command)).rejects.toThrowError(ZipCodeNotFoundException);
    });

  });

  describe('given error on find address by zipcode', () => {

    it('then throw not found error', async () => {
      addressRepository._response = Promise.reject({});

      await expect(handler.execute(command)).rejects.toThrowError(ZipCodeNotFoundException);
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
  _response;
  findDeliveryPrice() {
    return this._response;
  }
}