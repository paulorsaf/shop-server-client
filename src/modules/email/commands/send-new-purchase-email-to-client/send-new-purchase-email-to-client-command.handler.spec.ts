import { NotFoundException } from '@nestjs/common';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { NewPurchaseEmailSentToClientEvent } from '../../events/new-purchase-email-sent-to-client.event';
import { SendNewPurchaseEmailToClientFailedEvent } from '../../events/send-new-purchase-email-to-client-failed.event';
import { EmailRepository } from '../../repositories/email.repository';
import { PurchaseRepository } from '../../repositories/purchase.repository';
import { SendNewPurchaseEmailToClientCommandHandler } from './send-new-purchase-email-to-client-command.handler';
import { SendNewPurchaseEmailToClientCommand } from './send-new-purchase-email-to-client.command';

describe('SendNewPurchaseEmailToClientCommandHandler', () => {

  let eventBus: EventBusMock;
  let handler: SendNewPurchaseEmailToClientCommandHandler;
  let emailRepository: EmailRepositoryMock;
  let purchaseRepository: PurchaseRepositoryMock;

  let command: SendNewPurchaseEmailToClientCommand;

  beforeEach(async () => {
    emailRepository = new EmailRepositoryMock();
    purchaseRepository = new PurchaseRepositoryMock();

    command = new SendNewPurchaseEmailToClientCommand(
      "anyCompanyId",
      "anyPurchaseId"
    );

    eventBus = new EventBusMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        SendNewPurchaseEmailToClientCommandHandler
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

    handler = module.get<SendNewPurchaseEmailToClientCommandHandler>(SendNewPurchaseEmailToClientCommandHandler);
  });

  describe('given purchase found', () => {

    beforeEach(() => {
      purchaseRepository._response = {id: "purchaseId"};
      emailRepository._response = Promise.resolve({});
    })

    it('then send new purchase email to client', async () => {
      await handler.execute(command);
  
      expect(emailRepository._sent).toBeTruthy();
    })

    it('when email sent, then publish new purchase email sent to client event', async () => {
      await handler.execute(command);
  
      expect(eventBus.published).toEqual(
        new NewPurchaseEmailSentToClientEvent(
          "anyCompanyId", "anyPurchaseId"
        )
      );
    })

    it('when error on send email, then publish error on send new purchase email to client event', async () => {
      const error = {error: "error"};
      emailRepository._response = Promise.reject(error);

      await handler.execute(command);
  
      expect(eventBus.published).toEqual(
        new SendNewPurchaseEmailToClientFailedEvent(
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

  sendNewPurchaseToClient() {
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