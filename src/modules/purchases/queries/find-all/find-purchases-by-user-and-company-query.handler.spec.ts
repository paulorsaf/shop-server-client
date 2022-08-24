import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseRepository } from '../../repositories/purchase.repository';
import { FindPurchasesByUserAndCompanyQueryHandler } from './find-purchases-by-user-and-company-query.handler';
import { FindPurchasesByUserAndCompanyQuery } from './find-purchases-by-user-and-company.query';

describe('FindPurchasesByUserAndCompanyQueryHandler', () => {

  let handler: FindPurchasesByUserAndCompanyQueryHandler;

  let command: FindPurchasesByUserAndCompanyQuery;

  let purchaseRepository: PurchaseRepositoryMock;

  beforeEach(async () => {
    purchaseRepository = new PurchaseRepositoryMock();

    command = new FindPurchasesByUserAndCompanyQuery(
      "anyCompanyId", "anyUserId"
    );

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        FindPurchasesByUserAndCompanyQueryHandler
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

    handler = module.get<FindPurchasesByUserAndCompanyQueryHandler>(FindPurchasesByUserAndCompanyQueryHandler);
  });

  it('given find purchases by user and company, then return all purchases', async () => {
    const purchases = [{id: "anyPurchaseId1"}, {id: "anyPurchaseId2"}];
    purchaseRepository._response = purchases;

    const response = await handler.execute(command);

    expect(response).toEqual(purchases);
  })

});

class PurchaseRepositoryMock {
  _response;

  findAllByUserAndCompany() {
    return this._response;
  }
}