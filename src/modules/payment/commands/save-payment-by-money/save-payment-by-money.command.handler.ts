import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { PaymentByMoneySavedEvent } from "../../events/payment-by-money-saved.event";
import { Purchase } from "../../model/purchase.model";
import { PurchaseRepository } from "../../repositories/purchase.repository";
import { SavePaymentByMoneyCommand } from "./save-payment-by-money.command";

@CommandHandler(SavePaymentByMoneyCommand)
export class SavePaymentByMoneyCommandHandler implements ICommandHandler<SavePaymentByMoneyCommand> {

    constructor(
        private eventBus: EventBus,
        private purchaseRepository: PurchaseRepository
    ){}

    async execute(command: SavePaymentByMoneyCommand) {
        const purchase = await this.purchaseRepository.findByIdAndCompany({
            companyId: command.companyId, purchaseId: command.purchaseId
        })
        if (!purchase) {
            return null;
        }

        await this.purchaseRepository.updatePurchaseStatus(purchase, "PAID");

        this.publishPaymentByMoneySavedEvent(command, purchase);
    }

    private publishPaymentByMoneySavedEvent(command: SavePaymentByMoneyCommand, purchase: Purchase) {
        this.eventBus.publish(
            new PaymentByMoneySavedEvent(
                command.companyId,
                command.purchaseId,
                command.changeFor,
                purchase.user.id
            )
        );
    }

}