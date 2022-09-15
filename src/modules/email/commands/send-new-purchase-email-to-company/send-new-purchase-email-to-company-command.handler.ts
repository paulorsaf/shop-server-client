import { NotFoundException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { NewPurchaseEmailSentToCompanyEvent } from "../../events/new-purchase-email-sent-to-company.event";
import { SendNewPurchaseEmailToCompanyFailedEvent } from "../../events/send-new-purchase-email-to-company-failed.event";
import { EmailRepository } from "../../repositories/email.repository";
import { PurchaseRepository } from "../../repositories/purchase.repository";
import { SendNewPurchaseEmailToCompanyCommand } from "./send-new-purchase-email-to-company.command";

@CommandHandler(SendNewPurchaseEmailToCompanyCommand)
export class SendNewPurchaseEmailToCompanyCommandHandler implements ICommandHandler<SendNewPurchaseEmailToCompanyCommand> {

    constructor(
        private emailRepository: EmailRepository,
        private eventBus: EventBus,
        private purchaseRepository: PurchaseRepository
    ){}

    async execute(command: SendNewPurchaseEmailToCompanyCommand) {
        const purchase = await this.purchaseRepository.findByIdAndCompanyId({
            companyId: command.companyId, purchaseId: command.purchaseId
        });
        if (!purchase) {
            throw new NotFoundException('Compra nao encontrada');
        }

        try {
            await this.emailRepository.sendNewPurchaseToCompany(purchase);
            this.publishNewPurchaseEmailSentToCompanyEvent(command);
        } catch (error) {
            this.publishSendNewPurchaseEmailToCompanyFailedEvent(command, error);
        }
    }

    private publishNewPurchaseEmailSentToCompanyEvent(command: SendNewPurchaseEmailToCompanyCommand) {
        this.eventBus.publish(
            new NewPurchaseEmailSentToCompanyEvent(
                command.companyId,
                command.purchaseId
            )
        )
    }

    private publishSendNewPurchaseEmailToCompanyFailedEvent(
        command: SendNewPurchaseEmailToCompanyCommand, error: any
    ) {
        this.eventBus.publish(
            new SendNewPurchaseEmailToCompanyFailedEvent(
                command.companyId,
                command.purchaseId,
                error
            )
        )
    }

}