import { NotFoundException } from '@nestjs/common';
import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { EventBusMock } from '../../../../mocks/event-bus.mock';
import { NewPurchaseEmailSentToCompanyEvent } from '../../events/new-purchase-email-sent-to-company.event';
import { SendNewPurchaseEmailToCompanyFailedEvent } from '../../events/send-new-purchase-email-to-company-failed.event';
import { EmailRepository } from '../../repositories/email.repository';
import { PurchaseRepository } from '../../repositories/purchase.repository';
import { SendNewPurchaseEmailToCompanyCommandHandler } from './send-new-purchase-email-to-company-command.handler';
import { SendNewPurchaseEmailToCompanyCommand } from './send-new-purchase-email-to-company.command';

describe('SendNewPurchaseEmailToCompanyCommandHandler', () => {

  let eventBus: EventBusMock;
  let handler: SendNewPurchaseEmailToCompanyCommandHandler;
  let emailRepository: EmailRepositoryMock;
  let purchaseRepository: PurchaseRepositoryMock;

  let command: SendNewPurchaseEmailToCompanyCommand;

  beforeEach(async () => {
    emailRepository = new EmailRepositoryMock();
    purchaseRepository = new PurchaseRepositoryMock();

    command = new SendNewPurchaseEmailToCompanyCommand(
      "anyCompanyId",
      "anyPurchaseId"
    );

    eventBus = new EventBusMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        SendNewPurchaseEmailToCompanyCommandHandler
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

    handler = module.get<SendNewPurchaseEmailToCompanyCommandHandler>(SendNewPurchaseEmailToCompanyCommandHandler);
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

    it('when email sent, then publish new purchase email sent to company event', async () => {
      await handler.execute(command);
  
      expect(eventBus.published).toEqual(
        new NewPurchaseEmailSentToCompanyEvent(
          "anyCompanyId", "anyPurchaseId"
        )
      );
    })

    it('when error on send email, then publish error on send new purchase email to company event', async () => {
      const error = {error: "error"};
      emailRepository._response = Promise.reject(error);

      await handler.execute(command);
  
      expect(eventBus.published).toEqual(
        new SendNewPurchaseEmailToCompanyFailedEvent(
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

  sendNewPurchaseToCompany() {
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