import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { PurchaseRepository } from "../../repositories/purchase.repository";
import { SavePaymentErrorCommand } from "./save-payment-error.command";

@CommandHandler(SavePaymentErrorCommand)
export class SavePaymentErrorCommandHandler implements ICommandHandler<SavePaymentErrorCommand> {

    constructor(
        public purchaseRepository: PurchaseRepository
    ){}

    async execute(command: SavePaymentErrorCommand) {
        const purchase = await this.purchaseRepository.findByIdAndCompany({
            companyId: command.companyId, purchaseId: command.purchaseId
        });

        if (purchase) {
            purchase.payment.error = command.error;
            this.purchaseRepository.updatePaymentError(purchase);
        }
    }

}