import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseRepository } from '../../repositories/purchase.repository';
import { SavePaymentErrorCommandHandler } from './save-payment-error-command.handler';
import { SavePaymentErrorCommand } from './save-payment-error.command';

describe('SavePaymentErrorCommandHandler', () => {

  let handler: SavePaymentErrorCommandHandler;

  let command: SavePaymentErrorCommand;
  let purchaseRepository: PurchaseRepositoryMock;

  beforeEach(async () => {
    purchaseRepository = new PurchaseRepositoryMock();

    command = new SavePaymentErrorCommand(
      "anyCompanyId",
      "anyPurchaseId",
      {error: "anyError"}
    );

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        SavePaymentErrorCommandHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        PurchaseRepository
      ]
    })
    .overrideProvider(PurchaseRepository).useValue(purchaseRepository)
    .compile();

    handler = module.get<SavePaymentErrorCommandHandler>(SavePaymentErrorCommandHandler);
  });

  it('given purchase not found, then do not update purchase payment', async () => {
    await handler.execute(command)

    expect(purchaseRepository._isUpdated).toBeFalsy();
  })

  describe('given purchase found', () => {

    let purchase: PurchaseMock;

    beforeEach(() => {
      purchase = new PurchaseMock();
      purchaseRepository._response = Promise.resolve(purchase);
    })

    it('then set payment error', async () => {
      await handler.execute(command);

      expect(purchase.payment.error).toEqual({error: "anyError"});
    })

    it('then update purchase', async () => {
      await handler.execute(command);
  
      expect(purchaseRepository._isUpdated).toBeTruthy();
    })

  })

});

class PurchaseRepositoryMock {
  _isUpdated = false;
  _response;

  findByIdAndCompany() {
    return this._response;
  }

  updatePaymentError() {
    this._isUpdated = true;
  }

}

class PurchaseMock {
  payment = {
    error: null
  };
}