import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { Purchase } from "../../model/purchase.model";
import { PurchaseRepository } from "../../repositories/purchase.repository";
import { RetryPurchasePaymentCommand } from "./retry-purchase-payment.command";
import { NotFoundException } from '@nestjs/common';
import { PurchasePaymentRetriedEvent } from "../../events/purchase-payment-retried.event";

@CommandHandler(RetryPurchasePaymentCommand)
export class RetryPurchasePaymentCommandHandler implements ICommandHandler<RetryPurchasePaymentCommand> {

    constructor(
        private eventBus: EventBus,
        private purchaseRepository: PurchaseRepository
    ){}

    async execute(command: RetryPurchasePaymentCommand) {
        const purchase = await this.findPurchase(command);

        await this.purchaseRepository.updatePayment(
            this.createPurchaseUpdate(purchase, command)
        );

        this.publishPurchasePaymentRetriedEvent(command);
    }

    private async findPurchase(command: RetryPurchasePaymentCommand) {
        const purchase = await this.purchaseRepository.findByIdAndCompanyId({
            companyId: command.companyId, purchaseId: command.purchaseId
        });
        if (!purchase) {
            throw new NotFoundException('Compra nao encontrada');
        }
        return purchase;
    }

    private createPurchaseUpdate(purchase: Purchase, command: RetryPurchasePaymentCommand) {
        return new Purchase({
            ...purchase,
            payment: {
                changeFor: command.retryPurchaseDto.payment.changeFor,
                error: undefined,
                receiptUrl: undefined,
                type: command.retryPurchaseDto.payment.type
            }
        });
    }

    private publishPurchasePaymentRetriedEvent(command: RetryPurchasePaymentCommand){
        this.eventBus.publish(
            new PurchasePaymentRetriedEvent(
                command.companyId,
                command.purchaseId,
                command.retryPurchaseDto.payment
            )
        )
    }

}