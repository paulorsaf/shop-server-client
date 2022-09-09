import { NotFoundException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { PaymentSuccessEmailSentToClientEvent } from "../../events/payment-success-email-sent-to-client.event";
import { SendPaymentSuccessEmailToClientFailedEvent } from "../../events/send-payment-success-email-to-client-failed.event";
import { EmailRepository } from "../../repositories/email.repository";
import { PurchaseRepository } from "../../repositories/purchase.repository";
import { SendPaymentSuccessEmailToClientCommand } from "./send-payment-success-email-to-client.command";

@CommandHandler(SendPaymentSuccessEmailToClientCommand)
export class SendPaymentSuccessEmailToClientCommandHandler implements ICommandHandler<SendPaymentSuccessEmailToClientCommand> {

    constructor(
        private emailRepository: EmailRepository,
        private eventBus: EventBus,
        private purchaseRepository: PurchaseRepository
    ){}

    async execute(command: SendPaymentSuccessEmailToClientCommand) {
        const purchase = await this.purchaseRepository.findByIdAndCompanyId({
            companyId: command.companyId, purchaseId: command.purchaseId
        });
        if (!purchase) {
            throw new NotFoundException('Compra não encontrada');
        }

        await this.emailRepository.sendPaymentSuccessToClient(purchase).then(() => {
            this.publishPaymentSuccessEmailSentToClientEvent(command);
        }).catch(error => {
            this.publishSendPaymentSuccessEmailToClientFailedEvent(command, error);
        });
    }

    private publishPaymentSuccessEmailSentToClientEvent(command: SendPaymentSuccessEmailToClientCommand) {
        this.eventBus.publish(
            new PaymentSuccessEmailSentToClientEvent(
                command.companyId,
                command.purchaseId
            )
        )
    }

    private publishSendPaymentSuccessEmailToClientFailedEvent(
        command: SendPaymentSuccessEmailToClientCommand, error: any
    ) {
        this.eventBus.publish(
            new SendPaymentSuccessEmailToClientFailedEvent(
                command.companyId,
                command.purchaseId,
                error
            )
        )
    }

}