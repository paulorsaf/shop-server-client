import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { PaymentFactory } from '../../factories/payment.factory';
import { FindUserCreditCardsQueryHandler } from './find-user-credit-cards-query.handler';
import { FindUserCreditCardsQuery } from './find-user-credit-cards.query';

describe('FindUserCreditCardsQueryHandler', () => {

  let handler: FindUserCreditCardsQueryHandler;

  const command = new FindUserCreditCardsQuery("anyCompanyId", 'any@email.com');

  let paymentFactory: PaymentFactoryMock;

  beforeEach(async () => {
    paymentFactory = new PaymentFactoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        FindUserCreditCardsQueryHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        PaymentFactory
      ]
    })
    .overrideProvider(PaymentFactory).useValue(paymentFactory)
    .compile();

    handler = module.get<FindUserCreditCardsQueryHandler>(FindUserCreditCardsQueryHandler);
  });

  it('given email, then return credit cards', async () => {
    const creditCards = [{id: "anyCreditCardId1"}, {id: "anyCreditCardId2"}];
    paymentFactory._response = creditCards;

    const response = await handler.execute(command);

    expect(response).toEqual(creditCards);
  });

});

class PaymentFactoryMock {
  _response;
  createPayment(){
    return {
      findCreditCards: () => this._response
    }
  }
}