import { NotFoundException } from '@nestjs/common';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { PurchaseSummaryRepository } from '../../repositories/purchase-summary.repository';
import { PurchaseRepository } from '../../repositories/purchase.repository';
import { AddPurchaseSummaryCommandHandler } from './add-purchase-summary-command.handler';
import { AddPurchaseSummaryCommand } from './add-purchase-summary.command';

describe('AddPurchaseSummaryCommandHandler', () => {

  let eventBus: EventBusMock;
  let handler: AddPurchaseSummaryCommandHandler;

  let command: AddPurchaseSummaryCommand;
  let purchaseRepository: PurchaseRepositoryMock;
  let purchaseSummaryRepository: PurchaseSummaryRepositoryMock;

  beforeEach(async () => {
    command = new AddPurchaseSummaryCommand(
      "anyCompanyId", "anyPurchaseId"
    );
    eventBus = new EventBusMock();
    purchaseRepository = new PurchaseRepositoryMock();
    purchaseSummaryRepository = new PurchaseSummaryRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        AddPurchaseSummaryCommandHandler
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

    handler = module.get<AddPurchaseSummaryCommandHandler>(AddPurchaseSummaryCommandHandler);
  });

  it('given purchase not found, then do not add or create purchase summary', async () => {
    purchaseRepository._response = null;
  
    await handler.execute(command);

    expect(purchaseSummaryRepository._isAddedOrCreated).toBeFalsy();
  })

  describe('given purchase found', () => {

    beforeEach(() => {
      purchaseRepository._response = {id: 1, payment: {}, price: {}, products: [], user: {}};
    })

    it('when purchase summary not found, then create purchase summary', async () => {
      purchaseSummaryRepository._response = null;
  
      await handler.execute(command);
  
      expect(purchaseSummaryRepository._isCreated).toBeTruthy();
    })

    it('when purchase summary found, then add to purchase summary', async () => {
      purchaseSummaryRepository._response = {id: 1};
  
      await handler.execute(command);
  
      expect(purchaseSummaryRepository._isAdded).toBeTruthy();
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
  _isAdded = false;
  _isCreated = false;
  _isAddedOrCreated = false;
  _response;
  add() {
    this._isAdded = true;
    this._isAddedOrCreated = true;
  }
  create() {
    this._isCreated = true;
    this._isAddedOrCreated = true;
  }
  findByCompanyIdAndDate() {
    return this._response;
  }
}