import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { format } from "date-fns";
import { PurchaseSummaryRepository } from "../../repositories/purchase-summary.repository";
import { PurchaseRepository } from "../../repositories/purchase.repository";
import { SetPurchaseSummaryPaymentSuccessCommand } from "./set-purchase-summary-payment-success.command";

@CommandHandler(SetPurchaseSummaryPaymentSuccessCommand)
export class SetPurchaseSummaryPaymentSuccessCommandHandler implements ICommandHandler<SetPurchaseSummaryPaymentSuccessCommand> {

    constructor(
        private purchaseRepository: PurchaseRepository,
        private purchaseSummaryRepository: PurchaseSummaryRepository
    ){}

    async execute(command: SetPurchaseSummaryPaymentSuccessCommand) {
        const purchase = await this.purchaseRepository.findByIdAndCompanyId({
            companyId: command.companyId, id: command.purchaseId
        });

        if (purchase) {
            const dailyPurchaseSummary = await this.purchaseSummaryRepository.findByCompanyIdAndDate({
                companyId: command.companyId,
                date: format(new Date(purchase.createdAt), 'yyyy-MM-dd')
            });

            await this.purchaseSummaryRepository.updatePaymentSuccess({
                dailyPurchaseId: dailyPurchaseSummary.id,
                purchase
            })
        }
    }

}