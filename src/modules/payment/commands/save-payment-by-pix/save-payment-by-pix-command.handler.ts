import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { StringifyOptions } from "querystring";
import { PaymentByPixSavedEvent } from "../../events/payment-by-pix-saved.event";
import { PurchasePaymentByPix } from "../../model/purchase/purchase-payment-by-pix.model";
import { SavePaymentByPixCommand } from "./save-payment-by-pix.command";

@CommandHandler(SavePaymentByPixCommand)
export class SavePaymentByPixCommandHandler implements ICommandHandler<SavePaymentByPixCommand> {

    constructor(
        private eventBus: EventBus
    ){}
    
    async execute(command: SavePaymentByPixCommand) {
        const purchasePayment = command.purchasePayment;

        const receiptUrl = await purchasePayment.savePayment();

        this.publishPaymentByPixSavedEvent(purchasePayment, receiptUrl);
    }

    private publishPaymentByPixSavedEvent(
        purchasePayment: PurchasePaymentByPix, receiptUrl: string
    ) {
        this.eventBus.publish(
            new PaymentByPixSavedEvent(
                purchasePayment.companyId, 
                purchasePayment.purchaseId,
                receiptUrl,
                purchasePayment.userId
            )
        )
    }

}