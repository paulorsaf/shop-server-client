import { NotFoundException } from '@nestjs/common';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { NewPurchaseEmailSentToCompanyEvent } from '../../events/new-purchase-email-sent-to-company.event';
import { PaymentSuccessEmailSentToClientEvent } from '../../events/payment-success-email-sent-to-client.event';
import { SendNewPurchaseEmailToCompanyFailedEvent } from '../../events/send-new-purchase-email-to-company-failed.event';
import { SendPaymentSuccessEmailToClientFailedEvent } from '../../events/send-payment-success-email-to-client-failed.event';
import { EmailRepository } from '../../repositories/email.repository';
import { PurchaseRepository } from '../../repositories/purchase.repository';
import { SendPaymentSuccessEmailToClientCommandHandler } from './send-payment-success-email-to-client-command.handler';
import { SendPaymentSuccessEmailToClientCommand } from './send-payment-success-email-to-client.command';

describe('SendPaymentSuccessEmailToClientCommandHandler', () => {

  let eventBus: EventBusMock;
  let handler: SendPaymentSuccessEmailToClientCommandHandler;
  let emailRepository: EmailRepositoryMock;
  let purchaseRepository: PurchaseRepositoryMock;

  let command: SendPaymentSuccessEmailToClientCommand;

  beforeEach(async () => {
    emailRepository = new EmailRepositoryMock();
    purchaseRepository = new PurchaseRepositoryMock();

    command = new SendPaymentSuccessEmailToClientCommand(
      "anyCompanyId",
      "anyPurchaseId"
    );

    eventBus = new EventBusMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        SendPaymentSuccessEmailToClientCommandHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        EmailRepository,
        PurchaseRepository
      ]
    })
    .overrideProvider(EventBus).useValue(eventBus)
    .overrideProvider(EmailRepository).useValue(emailRepository)
    .overrideProvider(PurchaseRepository).useValue(purchaseRepository)
    .compile();

    handler = module.get<SendPaymentSuccessEmailToClientCommandHandler>(SendPaymentSuccessEmailToClientCommandHandler);
  });

  describe('given purchase found', () => {

    beforeEach(() => {
      purchaseRepository._response = {id: "purchaseId"};
      emailRepository._response = Promise.resolve({});
    })

    it('then send new purchase email to company', async () => {
      await handler.execute(command);
  
      expect(emailRepository._sent).toBeTruthy();
    })

    it('when email sent, then publish payment success email sent to client event', async () => {
      await handler.execute(command);
  
      expect(eventBus.published).toEqual(
        new PaymentSuccessEmailSentToClientEvent(
          "anyCompanyId", "anyPurchaseId"
        )
      );
    })

    it('when error on send email, then publish send payment success email to client failed event', async () => {
      const error = {error: "error"};
      emailRepository._response = Promise.reject(error);

      await handler.execute(command);
  
      expect(eventBus.published).toEqual(
        new SendPaymentSuccessEmailToClientFailedEvent(
          "anyCompanyId", "anyPurchaseId", error
        )
      );
    })

  })

  describe('given purchase not found', () => {

    it('then throw not found exception', async () => {
      await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
    })

  })

});

class EmailRepositoryMock {
  _response;
  _sent = false;

  sendPaymentSuccessToClient() {
    this._sent = true;
    return this._response;
  }
}

class PurchaseRepositoryMock {
  _response;

  findByIdAndCompanyId() {
    return this._response;
  }
}