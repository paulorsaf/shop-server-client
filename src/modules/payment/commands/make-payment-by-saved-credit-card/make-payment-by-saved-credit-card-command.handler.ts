import { NotFoundException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { PaymentByCreditCardCreatedEvent } from "../../events/payment-by-credit-card-created.event";
import { PaymentFailedEvent } from "../../events/payment-failed.event";
import { PurchaseRepository } from "../../repositories/purchase.repository";
import { MakePaymentBySavedCreditCardCommand } from "./make-payment-by-saved-credit-card.command";
import { PaymentFactory } from "../../factories/payment.factory";
import { PayByCreditCardResponse } from "../../repositories/payment-gateway/payment-gateway.interface";

@CommandHandler(MakePaymentBySavedCreditCardCommand)
export class MakePaymentBySavedCreditCardCommandHandler implements ICommandHandler<MakePaymentBySavedCreditCardCommand> {

    constructor(
        private eventBus: EventBus,
        private paymentFactory: PaymentFactory,
        private purchaseRepository: PurchaseRepository
    ){}

    async execute(command: MakePaymentBySavedCreditCardCommand) {
        const purchase = await this.purchaseRepository.findByIdAndCompany({
            companyId: command.companyId, purchaseId: command.purchaseId
        });
        if (!purchase) {
            throw new NotFoundException();
        }
        
        try {
            const repository = this.paymentFactory.createPayment(command.companyId);
            const paymentDetails = await repository.payBySavedCreditCard({
                id: command.creditCardId,
                purchaseId: command.purchaseId,
                user: {
                    email: purchase.user.email,
                    id: purchase.user.id
                },
                totalPrice: purchase.price.totalWithPaymentFee
            });
            await this.purchaseRepository.updatePaymentByCreditCard({
                purchaseId: purchase.id, paymentDetails
            });

            this.publishPaymentBySavedCreditCardCreatedEvent(command, paymentDetails);
        } catch (error) {
            this.publishPaymentFailedEvent(command, error);
        }
    }

    private publishPaymentBySavedCreditCardCreatedEvent(
        command: MakePaymentBySavedCreditCardCommand, paymentDetails: PayByCreditCardResponse
    ) {
        this.eventBus.publish(
            new PaymentByCreditCardCreatedEvent(
                command.companyId,
                command.purchaseId,
                paymentDetails
            )
        );
    }

    private publishPaymentFailedEvent(command: MakePaymentBySavedCreditCardCommand, error: any) {
        this.eventBus.publish(
            new PaymentFailedEvent(
                command.companyId,
                command.purchaseId,
                error
            )
        );
    }

}