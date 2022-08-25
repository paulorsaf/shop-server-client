import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { PaymentByPixSelectedEvent } from "../../events/payment-by-pix-selected.event";
import { PurchaseRepository } from "../../repositories/purchase.repository";
import { SelectPurchasePaymentCommand } from "./select-purchase-payment.command";

@CommandHandler(SelectPurchasePaymentCommand)
export class SelectPurchasePaymentCommandHandler implements ICommandHandler<SelectPurchasePaymentCommand> {

    constructor(
        private eventBus: EventBus,
        private purchaseRepository: PurchaseRepository
    ){}

    async execute(command: SelectPurchasePaymentCommand) {
        const purchase = await this.purchaseRepository.findByIdAndCompany({
            companyId: command.companyId, purchaseId: command.purchaseId
        });

        if (purchase.payment.type === "PIX") {
            this.publishPaymentByPixSelectedEvent(command);
        }
    }

    private publishPaymentByPixSelectedEvent(command: SelectPurchasePaymentCommand) {
        this.eventBus.publish(
            new PaymentByPixSelectedEvent(
                command.companyId,
                command.purchaseId,
                command.receipt
            )
        );
    }

}