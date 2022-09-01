import { NotFoundException } from "@nestjs/common";
import { CommandHandler, EventBus, IQueryHandler } from "@nestjs/cqrs";
import { NewPurchaseEmailSentToClientEvent } from "../../events/new-purchase-email-sent-to-client.event";
import { SendNewPurchaseEmailToClientFailedEvent } from "../../events/send-new-purchase-email-to-client-failed.event";
import { EmailRepository } from "../../repositories/email.repository";
import { PurchaseRepository } from "../../repositories/purchase.repository";
import { SendNewPurchaseEmailToClientCommand } from "../send-new-purchase-email-to-client/send-new-purchase-email-to-client.command";

@CommandHandler(SendNewPurchaseEmailToClientCommand)
export class SendNewPurchaseEmailToClientCommandHandler implements IQueryHandler<SendNewPurchaseEmailToClientCommand> {

    constructor(
        private emailRepository: EmailRepository,
        private eventBus: EventBus,
        private purchaseRepository: PurchaseRepository
    ){}

    async execute(command: SendNewPurchaseEmailToClientCommand) {
        const purchase = await this.purchaseRepository.findByIdAndCompanyId({
            companyId: command.companyId, purchaseId: command.purchaseId
        });
        if (!purchase) {
            throw new NotFoundException('Compra nao encontrada');
        }

        await this.emailRepository.sendNewPurchaseToClient(purchase).then(() => {
            this.publishNewPurchaseEmailSentToClientEvent(command);
        }).catch(error => {
            this.publishSendNewPurchaseEmailToClientFailedEvent(command, error);
        });
    }

    private publishNewPurchaseEmailSentToClientEvent(command: SendNewPurchaseEmailToClientCommand) {
        this.eventBus.publish(
            new NewPurchaseEmailSentToClientEvent(
                command.companyId,
                command.purchaseId
            )
        )
    }

    private publishSendNewPurchaseEmailToClientFailedEvent(
        command: SendNewPurchaseEmailToClientCommand, error: any
    ) {
        this.eventBus.publish(
            new SendNewPurchaseEmailToClientFailedEvent(
                command.companyId,
                command.purchaseId,
                error
            )
        )
    }

}