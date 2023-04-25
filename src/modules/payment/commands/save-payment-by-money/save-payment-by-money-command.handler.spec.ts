import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { PaymentByMoneySavedEvent } from '../../events/payment-by-money-saved.event';
import { PurchaseRepository } from '../../repositories/purchase.repository';
import { StorageRepository } from '../../repositories/storage.repository';
import { SavePaymentByMoneyCommand } from './save-payment-by-money.command';
import { SavePaymentByMoneyCommandHandler } from './save-payment-by-money.command.handler';

describe('SavePaymentByMoneyCommandHandler', () => {

  let eventBus: EventBusMock;
  let handler: SavePaymentByMoneyCommandHandler;

  let command = new SavePaymentByMoneyCommand(
    "anyCompanyId",
    "anyPurchaseId",
    10
  );
  let purchaseRepository: PurchaseRepositoryMock;

  beforeEach(async () => {
    eventBus = new EventBusMock();

    purchaseRepository = new PurchaseRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        SavePaymentByMoneyCommandHandler
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
    .compile();

    handler = module.get<SavePaymentByMoneyCommandHandler>(SavePaymentByMoneyCommandHandler);
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
    })
  
    it('then save payment by money', async () => {
      await handler.execute(command);
  
      expect(purchaseRepository._isPaymentSaved).toBeTruthy();
    })
  
    it('when payment saved, then publish payment by money saved event', async () => {
      await handler.execute(command);
  
      expect(eventBus.published).toBeInstanceOf(PaymentByMoneySavedEvent);
    })

  })

});

class PurchaseRepositoryMock {
  _response;

  _isPaymentSaved = false;

  findByIdAndCompany() {
    return this._response;
  }

  updatePurchaseStatus() {
    this._isPaymentSaved = true;
  }
}