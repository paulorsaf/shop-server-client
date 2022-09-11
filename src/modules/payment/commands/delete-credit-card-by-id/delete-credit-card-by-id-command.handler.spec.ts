import { NotFoundException } from '@nestjs/common';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { CreditCardDeletedEvent } from '../../events/credit-card-deleted.event';
import { PaymentFactory } from '../../factories/payment.factory';
import { PurchaseRepository } from '../../repositories/purchase.repository';
import { DeleteCreditCardByIdCommandHandler } from './delete-credit-card-by-id-command.handler';
import { DeleteCreditCardByIdCommand } from './delete-credit-card-by-id.command';

describe('DeleteCreditCardByIdCommandHandler', () => {

  let eventBus: EventBusMock;
  let handler: DeleteCreditCardByIdCommandHandler;

  let command = new DeleteCreditCardByIdCommand(
    "anyCompanyId",
    "anyCardId",
    {email: "any@email.com", id: "anyUserId"}
  );
  let paymentFactory: PaymentFactoryMock;

  beforeEach(async () => {
    eventBus = new EventBusMock();

    paymentFactory = new PaymentFactoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        DeleteCreditCardByIdCommandHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        PaymentFactory,
        PurchaseRepository
      ]
    })
    .overrideProvider(EventBus).useValue(eventBus)
    .overrideProvider(PaymentFactory).useValue(paymentFactory)
    .compile();

    handler = module.get<DeleteCreditCardByIdCommandHandler>(DeleteCreditCardByIdCommandHandler);
  });

  describe('given credit card found', () => {

    beforeEach(() => {
      paymentFactory._response = {id: "anyPaymentId"};
    })

    it('then delete credit card', async () => {
      await handler.execute(command);

      expect(paymentFactory._isDeleted).toBeTruthy();
    })

    it('when payment made, then publish payment by credit card created event', async () => {
      await handler.execute(command);

      expect(eventBus.published).toEqual(
        new CreditCardDeletedEvent(
          "anyCompanyId",
          "anyPaymentId",
          "anyUserId"
        )
      );
    })

  })

  it('given credit card not found, then throw not found exception', async () => {
    await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
  })

});

class PaymentFactoryMock {
  _isDeleted = false;
  _response;

  createPayment() {
    return {
      deleteCreditCard: () => {
        this._isDeleted = true;
      },
      findCreditCardById: () => this._response
    }
  }
}