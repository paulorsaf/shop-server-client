import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { PurchaseSummaryRepository } from '../../repositories/purchase-summary.repository';
import { PurchaseRepository } from '../../repositories/purchase.repository';
import { SetPurchaseSummaryGeolocationCommandHandler } from './set-purchase-summary-geolocation-command.handler';
import { SetPurchaseSummaryGeolocationCommand } from './set-purchase-summary-geolocation.command';

describe('SetPurchaseSummaryGeolocationCommandHandler', () => {

  let eventBus: EventBusMock;
  let handler: SetPurchaseSummaryGeolocationCommandHandler;

  let command: SetPurchaseSummaryGeolocationCommand;
  let purchaseRepository: PurchaseRepositoryMock;
  let purchaseSummaryRepository: PurchaseSummaryRepositoryMock;

  beforeEach(async () => {
    command = new SetPurchaseSummaryGeolocationCommand(
      "anyCompanyId", "anyPurchaseId"
    );
    eventBus = new EventBusMock();
    purchaseRepository = new PurchaseRepositoryMock();
    purchaseSummaryRepository = new PurchaseSummaryRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        SetPurchaseSummaryGeolocationCommandHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        PurchaseRepository,
        PurchaseSummaryRepository
      ]
    })
    .overrideProvider(EventBus).useValue(eventBus)
    .overrideProvider(PurchaseRepository).useValue(purchaseRepository)
    .overrideProvider(PurchaseSummaryRepository).useValue(purchaseSummaryRepository)
    .compile();

    handler = module.get<SetPurchaseSummaryGeolocationCommandHandler>(SetPurchaseSummaryGeolocationCommandHandler);
  });

  it('given purchase not found, then do not update purchase summary payment error', async () => {
    purchaseRepository._response = null;
  
    await handler.execute(command);

    expect(purchaseSummaryRepository._isUpdated).toBeFalsy();
  })

  describe('given purchase found', () => {

    beforeEach(() => {
      purchaseRepository._response = {
        id: 1, createdAt: '2022-09-16T12:32:58', address: {latitude: 1, longitude: 2}
      };
      purchaseSummaryRepository._response = {id: 1};
    })

    it('then update purchase summary payment error', async () => {
      await handler.execute(command);
  
      expect(purchaseSummaryRepository._isUpdated).toBeTruthy();
    })

  })

});

class PurchaseRepositoryMock {
  _response;
  findByIdAndCompanyId() {
    return this._response;
  }
}
class PurchaseSummaryRepositoryMock {
  _isUpdated = false;
  _response;
  findByCompanyIdAndDate() {
    return this._response;
  }
  updateLocation() {
    this._isUpdated = true;
  }
}