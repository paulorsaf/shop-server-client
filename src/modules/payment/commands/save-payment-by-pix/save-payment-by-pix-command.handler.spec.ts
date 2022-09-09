import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { PaymentByPixSavedEvent } from '../../events/payment-by-pix-saved.event';
import { PaymentFailedEvent } from '../../events/payment-failed.event';
import { PurchaseRepository } from '../../repositories/purchase.repository';
import { StorageRepository } from '../../repositories/storage.repository';
import { SavePaymentByPixCommandHandler } from './save-payment-by-pix-command.handler';
import { SavePaymentByPixCommand } from './save-payment-by-pix.command';

describe('SavePaymentByPixCommandHandler', () => {

  let eventBus: EventBusMock;
  let handler: SavePaymentByPixCommandHandler;

  let command = new SavePaymentByPixCommand(
    "anyCompanyId",
    "anyPurchaseId",
    "anyReceipt"
  );
  let purchaseRepository: PurchaseRepositoryMock;
  let storageRepository: StorageRepositoryMock;

  beforeEach(async () => {
    eventBus = new EventBusMock();

    purchaseRepository = new PurchaseRepositoryMock();
    storageRepository = new StorageRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        SavePaymentByPixCommandHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        PurchaseRepository,
        StorageRepository
      ]
    })
    .overrideProvider(EventBus).useValue(eventBus)
    .overrideProvider(PurchaseRepository).useValue(purchaseRepository)
    .overrideProvider(StorageRepository).useValue(storageRepository)
    .compile();

    handler = module.get<SavePaymentByPixCommandHandler>(SavePaymentByPixCommandHandler);
  });

  describe('given purchase not found', () => {

    it('then return null', async () => {
      const response = await handler.execute(command);

      expect(response).toBeNull();
    })

  })

  describe('given purchase found', () => {

    let purchase;

    beforeEach(() => {
      purchase = {
        companyId: "anyCompanyId",
        payment: {
          receiptUrl: "",
          type: "PIX"
        },
        id: "anyPurchaseId",
        user: {
          id: "anyUserId"
        }
      };
      purchaseRepository._response = purchase;

      storageRepository._response = "anyReceiptUrl";
    })

    it('then save receipt on storage', async () => {
      await handler.execute(command);
  
      expect(storageRepository._isStored).toBeTruthy();
    })

    it('then set payment receipt as stored receipt url', async () => {
      await handler.execute(command);

      expect(purchase.payment.receiptUrl).toEqual("anyReceiptUrl");
    })
  
    it('then save payment by pix', async () => {
      await handler.execute(command);
  
      expect(purchaseRepository._isPaymentSaved).toBeTruthy();
    })
  
    it('when payment saved, then publish payment by pix saved event', async () => {
      await handler.execute(command);
  
      expect(eventBus.published).toBeInstanceOf(PaymentByPixSavedEvent);
    })

    it('when payment by pix failed, then publish payment failed event', async () => {
      storageRepository._response = Promise.reject({error: "anyError"});

      await handler.execute(command);
  
      expect(eventBus.published).toBeInstanceOf(PaymentFailedEvent);
    })

  })

});

class PurchaseRepositoryMock {
  _response;

  _isPaymentSaved = false;

  findByIdAndCompany() {
    return this._response;
  }

  updatePaymentByPix() {
    this._isPaymentSaved = true;
  }
}

class StorageRepositoryMock {
  _response;

  _isStored = false;

  saveFile() {
    this._isStored = true;
    return this._response;
  }
}