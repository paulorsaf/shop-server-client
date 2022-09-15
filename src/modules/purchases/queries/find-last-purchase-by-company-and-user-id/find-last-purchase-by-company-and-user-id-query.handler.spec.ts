import { NotFoundException } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseRepository } from '../../repositories/purchase.repository';
import { FindLastPurchaseByCompanyAndUserIdQueryHandler } from './find-last-purchase-by-company-and-user-id-query.handler';
import { FindLastPurchaseByCompanyAndUserIdQuery } from './find-last-purchase-by-company-and-user-id.query';

describe('FindLastPurchaseByCompanyAndUserIdQueryHandler', () => {

  let handler: FindLastPurchaseByCompanyAndUserIdQueryHandler;

  let query: FindLastPurchaseByCompanyAndUserIdQuery;

  let purchaseRepository: PurchaseRepositoryMock;

  beforeEach(async () => {
    purchaseRepository = new PurchaseRepositoryMock();

    query = new FindLastPurchaseByCompanyAndUserIdQuery(
      "anyCompanyId", "anyUserId"
    );

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        FindLastPurchaseByCompanyAndUserIdQueryHandler
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

    handler = module.get<FindLastPurchaseByCompanyAndUserIdQueryHandler>(FindLastPurchaseByCompanyAndUserIdQueryHandler);
  });

  describe('given purchase found', () => {

    it('then return purchase', async () => {
      const purchase = {id: "anyPurchase", user: {id: "anyUserId"}} as any;
      purchaseRepository._response = purchase;

      const response = await handler.execute(query);
  
      expect(response).toEqual(purchase);
    })

  })

  it('given purchase not found, then throw not found exception', async () => {
    await expect(handler.execute(query)).rejects.toThrowError(NotFoundException);
  })

});

class PurchaseRepositoryMock {
  _response;
  findByUserIdAndCompanyId() {
    return this._response;
  }
}