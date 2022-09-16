import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { format } from "date-fns";
import { PurchaseSummaryRepository } from "../../repositories/purchase-summary.repository";
import { PurchaseRepository } from "../../repositories/purchase.repository";
import { SetPurchaseSummaryPaymentErrorCommand } from "./set-purchase-summary-payment-error.command";

@CommandHandler(SetPurchaseSummaryPaymentErrorCommand)
export class SetPurchaseSummaryPaymentErrorCommandHandler implements ICommandHandler<SetPurchaseSummaryPaymentErrorCommand> {

    constructor(
        private purchaseRepository: PurchaseRepository,
        private purchaseSummaryRepository: PurchaseSummaryRepository
    ){}

    async execute(command: SetPurchaseSummaryPaymentErrorCommand) {
        const purchase = await this.purchaseRepository.findByIdAndCompanyId({
            companyId: command.companyId, id: command.purchaseId
        });

        if (purchase) {
            const dailyPurchaseSummary = await this.purchaseSummaryRepository.findByCompanyIdAndDate({
                companyId: command.companyId,
                date: format(new Date(purchase.createdAt), 'yyyy-MM-dd')
            });

            await this.purchaseSummaryRepository.updatePaymentError({
                dailyPurchaseId: dailyPurchaseSummary.id,
                error: command.error,
                purchaseId: purchase.id
            })
        }
    }

}