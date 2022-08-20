import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { PaymentByPixSelectedEvent } from "../../events/payment-by-pix-selected.event";
import { SelectPurchasePaymentCommand } from "./select-purchase-payment.command";

@CommandHandler(SelectPurchasePaymentCommand)
export class SelectPurchasePaymentCommandHandler implements ICommandHandler<SelectPurchasePaymentCommand> {

    constructor(
        private eventBus: EventBus
    ){}

    async execute(command: SelectPurchasePaymentCommand) {
        if (command.purchase.payment.type === "PIX") {
            this.publishPaymentByPixSelectedEvent(command);
        }
    }

    private publishPaymentByPixSelectedEvent(command: SelectPurchasePaymentCommand) {
        this.eventBus.publish(
            new PaymentByPixSelectedEvent(
                command.purchase
            )
        );
    }

}