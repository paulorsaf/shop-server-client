import { NotFoundException } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseRepository } from '../../repositories/purchase.repository';
import { FindPurchaseByIdQueryHandler } from './find-purchase-by-id-query.handler';
import { FindPurchaseByIdQuery } from './find-purchase-by-id.query';

describe('FindPurchaseByIdQueryHandler', () => {

  let handler: FindPurchaseByIdQueryHandler;

  let query: FindPurchaseByIdQuery;

  let purchaseRepository: PurchaseRepositoryMock;

  beforeEach(async () => {
    purchaseRepository = new PurchaseRepositoryMock();

    query = new FindPurchaseByIdQuery(
      "anyCompanyId", "anyUserId", "anyPurchaseId"
    );

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        FindPurchaseByIdQueryHandler
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

    handler = module.get<FindPurchaseByIdQueryHandler>(FindPurchaseByIdQueryHandler);
  });

  describe('given purchase found', () => {

    it('then return purchase', async () => {
      const purchase = {id: "anyPurchase", user: {id: "anyUserId"}} as any;
      purchaseRepository._response = purchase;

      const response = await handler.execute(query);
  
      expect(response).toEqual(purchase);
    })

    it('when purchase doesnt belong to user, then throw not found exception', async () => {
      const purchase = {id: "anyPurchase", user: {id: "anyOtherUserId"}} as any;
      purchaseRepository._response = purchase;

      await expect(handler.execute(query)).rejects.toThrowError(NotFoundException);
    })

  })

  it('given purchase not found, then throw not found exception', async () => {
    await expect(handler.execute(query)).rejects.toThrowError(NotFoundException);
  })

});

class PurchaseRepositoryMock {
  _response;
  findByIdAndCompanyId() {
    return this._response;
  }
}