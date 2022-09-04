import { NotFoundException } from '@nestjs/common';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { PurchaseGeolocationSavedEvent } from '../../events/puchase-geolocation-saved.event';
import { AddressRepository } from '../../repositories/address.repository';
import { PurchaseRepository } from '../../repositories/purchase.repository';
import { SavePurchaseGeolocationCommandHandler } from './save-purchase-geolocation-command.handler';
import { SavePurchaseGeolocationCommand } from './save-purchase-geolocation.command';

describe('SavePurchaseGeolocationCommandHandler', () => {

  let eventBus: EventBusMock;
  let handler: SavePurchaseGeolocationCommandHandler;

  let command: SavePurchaseGeolocationCommand;
  let addressRepository: AddressRepositoryMock;
  let purchaseRepository: PurchaseRepositoryMock;

  beforeEach(async () => {
    addressRepository = new AddressRepositoryMock();
    purchaseRepository = new PurchaseRepositoryMock();

    command = new SavePurchaseGeolocationCommand(
      "anyCompanyId",
      "anyPurchaseId"
    );

    eventBus = new EventBusMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        SavePurchaseGeolocationCommandHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        AddressRepository,
        PurchaseRepository
      ]
    })
    .overrideProvider(AddressRepository).useValue(addressRepository)
    .overrideProvider(EventBus).useValue(eventBus)
    .overrideProvider(PurchaseRepository).useValue(purchaseRepository)
    .compile();

    handler = module.get<SavePurchaseGeolocationCommandHandler>(SavePurchaseGeolocationCommandHandler);
  });

  describe('given purchase found', () => {

    describe('when delivery', () => {
      
      beforeEach(() => {
        purchaseRepository._response = {id: "anyPurchaseId", address: {zipCode: "anyZipCode"}};
      })

      describe('and address geolocation found', () => {

        beforeEach(() => {
          addressRepository._response = {latitude: 1, longitude: 2};
        });

        it('then update purchase geolocation', async () => {
          await handler.execute(command);
      
          expect(purchaseRepository._isGeolocationUpdated).toBeTruthy();
        })

        it('then publish purchase geolocation saved event', async () => {
          await handler.execute(command);
      
          expect(eventBus.published).toEqual(
            new PurchaseGeolocationSavedEvent(
              "anyCompanyId",
              "anyPurchaseId",
              {latitude: 1, longitude: 2}
            )
          );
        })

      })

      describe('and address geolocation not found', () => {

        beforeEach(() => {
          addressRepository._response = null;
        })

        it('then do not update purchase geolocation', async () => {
          await handler.execute(command);
      
          expect(eventBus.published).toBeUndefined();
        })

      })

    })

    describe('when pick up', () => {
      
      beforeEach(() => {
        purchaseRepository._response = {id: "anyPurchaseId"};
      })

      it('then do not update purchase geolocation', async () => {
        await handler.execute(command);
    
        expect(purchaseRepository._isGeolocationUpdated).toBeFalsy();
      })

    })

  })

  describe('given purchase not found', () => {
      
    beforeEach(() => {
      purchaseRepository._response = null;
    })

    it('then throw not found exception', async () => {
      await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
    })

  })

});

class AddressRepositoryMock {
  _response;
  findGeolocationByZipCode() {
    return this._response;
  }
}

class PurchaseRepositoryMock {
  _isGeolocationUpdated = false;
  _response;
  
  findByIdAndCompanyId() {
    return this._response;
  }
  updateGeolocation(){
    this._isGeolocationUpdated = true;
  }
}