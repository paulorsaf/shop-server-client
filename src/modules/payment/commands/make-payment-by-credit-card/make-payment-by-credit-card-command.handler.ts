import { NotFoundException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { PaymentByCreditCardCreatedEvent } from "../../events/payment-by-credit-card-created.event";
import { PaymentFailedEvent } from "../../events/payment-failed.event";
import { PurchaseRepository } from "../../repositories/purchase.repository";
import { MakePaymentByCreditCardCommand } from "./make-payment-by-credit-card.command";
import { PaymentFactory } from "../../factories/payment.factory";
import { PayByCreditCardResponse } from "../../repositories/payment-gateway/payment-gateway.interface";

@CommandHandler(MakePaymentByCreditCardCommand)
export class MakePaymentByCreditCardCommandHandler implements ICommandHandler<MakePaymentByCreditCardCommand> {

    constructor(
        private eventBus: EventBus,
        private paymentFactory: PaymentFactory,
        private purchaseRepository: PurchaseRepository
    ){}

    async execute(command: MakePaymentByCreditCardCommand) {
        const purchase = await this.purchaseRepository.findByIdAndCompany({
            companyId: command.companyId, purchaseId: command.purchaseId
        });
        if (!purchase) {
            throw new NotFoundException();
        }
        
        try {
            const repository = this.paymentFactory.createPayment(command.companyId);
            const paymentDetails = await repository.payByCreditCard({
                billingAddress: command.billingAddress,
                companyId: command.companyId,
                creditCard: command.creditCard,
                totalPrice: purchase.price.totalWithPaymentFee,
                user: {
                    email: purchase.user.email
                }
            });
            await this.purchaseRepository.updatePaymentByCreditCard({
                purchaseId: purchase.id, paymentDetails
            });

            this.publishPaymentByCreditCardCreatedEvent(command, paymentDetails);
        } catch (error) {
            this.publishPaymentFailedEvent(command, error);
        }
    }

    private publishPaymentByCreditCardCreatedEvent(
        command: MakePaymentByCreditCardCommand, paymentDetails: PayByCreditCardResponse
    ) {
        this.eventBus.publish(
            new PaymentByCreditCardCreatedEvent(
                command.companyId,
                command.purchaseId,
                paymentDetails
            )
        );
    }

    private publishPaymentFailedEvent(command: MakePaymentByCreditCardCommand, error: any) {
        this.eventBus.publish(
            new PaymentFailedEvent(
                command.companyId,
                command.purchaseId,
                error
            )
        );
    }

}