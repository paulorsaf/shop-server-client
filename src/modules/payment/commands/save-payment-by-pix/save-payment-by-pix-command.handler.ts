import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { PaymentByPixSavedEvent } from "../../events/payment-by-pix-saved.event";
import { PaymentFailedEvent } from "../../events/payment-failed.event";
import { Purchase } from "../../model/purchase.model";
import { PurchaseRepository } from "../../repositories/purchase.repository";
import { StorageRepository } from "../../repositories/storage.repository";
import { SavePaymentByPixCommand } from "./save-payment-by-pix.command";

@CommandHandler(SavePaymentByPixCommand)
export class SavePaymentByPixCommandHandler implements ICommandHandler<SavePaymentByPixCommand> {

    constructor(
        private eventBus: EventBus,
        private purchaseRepository: PurchaseRepository,
        private storageRepository: StorageRepository
    ){}
    
    async execute(command: SavePaymentByPixCommand) {
        const purchase = await this.purchaseRepository.findByIdAndCompany({
            companyId: command.companyId, purchaseId: command.purchaseId
        })
        if (!purchase) {
            return null;
        }

        try {
            const fileUrl = await this.saveFileOnRepository(command);

            purchase.payment.receiptUrl = fileUrl;
            this.purchaseRepository.updatePaymentByPix(purchase)

            this.publishPaymentByPixSavedEvent(purchase);
        } catch (error) {
            this.publishPaymentFailedEvent(purchase, error);
        }
    }

    private async saveFileOnRepository(command: SavePaymentByPixCommand) {
        return await this.storageRepository.saveFile({
            companyId: command.companyId,
            purchaseId: command.purchaseId,
            receipt: command.receipt
        });
    }

    private publishPaymentByPixSavedEvent(purchase: Purchase) {
        this.eventBus.publish(
            new PaymentByPixSavedEvent(
                purchase.companyId, 
                purchase.id,
                purchase.payment.receiptUrl,
                purchase.user.id
            )
        )
    }

    private publishPaymentFailedEvent(purchase: Purchase, error: any) {
        this.eventBus.publish(
            new PaymentFailedEvent(
                purchase.companyId, 
                purchase.id,
                error
            )
        )
    }

}