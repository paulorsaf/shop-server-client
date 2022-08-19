import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { FindPurchasesByUserAndCompanyQueryHandler } from './find-purchases-by-user-and-company-query.handler';
import { FindPurchasesByUserAndCompanyQuery } from './find-purchases-by-user-and-company.query';

describe('FindPurchasesByUserAndCompanyQueryHandler', () => {

  let eventBus: EventBusMock;
  let handler: FindPurchasesByUserAndCompanyQueryHandler;

  let command: FindPurchasesByUserAndCompanyQuery;

  let purchase: PurchaseMock;

  beforeEach(async () => {
    purchase = new PurchaseMock();

    command = new FindPurchasesByUserAndCompanyQuery(purchase as any);

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        FindPurchasesByUserAndCompanyQueryHandler
      ],
      imports: [
        CqrsModule
      ]
    })
    .compile();

    handler = module.get<FindPurchasesByUserAndCompanyQueryHandler>(FindPurchasesByUserAndCompanyQueryHandler);
  });

  it('given find purchases by user and company, then return all purchases', async () => {
    const purchases = [{id: "anyPurchaseId1"}, {id: "anyPurchaseId2"}];
    purchase._response = purchases;

    const response = await handler.execute(command);

    expect(response).toEqual(purchases);
  })

});

class PurchaseMock {
  _response;

  findAllByUserAndCompany() {
    return this._response;
  }
}