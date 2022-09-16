import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { PurchaseSummaryRepository } from '../../repositories/purchase-summary.repository';
import { PurchaseRepository } from '../../repositories/purchase.repository';
import { SetPurchaseSummaryPaymentSuccessCommandHandler } from './set-purchase-summary-payment-success-command.handler';
import { SetPurchaseSummaryPaymentSuccessCommand } from './set-purchase-summary-payment-success.command';

describe('SetPurchaseSummaryPaymentSuccessCommandHandler', () => {

  let eventBus: EventBusMock;
  let handler: SetPurchaseSummaryPaymentSuccessCommandHandler;

  let command: SetPurchaseSummaryPaymentSuccessCommand;
  let purchaseRepository: PurchaseRepositoryMock;
  let purchaseSummaryRepository: PurchaseSummaryRepositoryMock;

  beforeEach(async () => {
    command = new SetPurchaseSummaryPaymentSuccessCommand(
      "anyCompanyId", "anyPurchaseId"
    );
    eventBus = new EventBusMock();
    purchaseRepository = new PurchaseRepositoryMock();
    purchaseSummaryRepository = new PurchaseSummaryRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        SetPurchaseSummaryPaymentSuccessCommandHandler
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

    handler = module.get<SetPurchaseSummaryPaymentSuccessCommandHandler>(SetPurchaseSummaryPaymentSuccessCommandHandler);
  });

  it('given purchase not found, then do not update purchase summary payment success', async () => {
    purchaseRepository._response = null;
  
    await handler.execute(command);

    expect(purchaseSummaryRepository._isUpdated).toBeFalsy();
  })

  describe('given purchase found', () => {

    beforeEach(() => {
      purchaseRepository._response = {
        id: 1, createdAt: '2022-09-16T12:32:58', payment: {receiptUrl: "anyUrl"}
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
  updatePaymentSuccess() {
    this._isUpdated = true;
  }
}