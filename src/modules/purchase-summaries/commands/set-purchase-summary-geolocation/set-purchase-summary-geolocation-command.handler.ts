import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { format } from "date-fns";
import { PurchaseSummaryRepository } from "../../repositories/purchase-summary.repository";
import { PurchaseRepository } from "../../repositories/purchase.repository";
import { SetPurchaseSummaryGeolocationCommand } from "./set-purchase-summary-geolocation.command";

@CommandHandler(SetPurchaseSummaryGeolocationCommand)
export class SetPurchaseSummaryGeolocationCommandHandler implements ICommandHandler<SetPurchaseSummaryGeolocationCommand> {

    constructor(
        private purchaseRepository: PurchaseRepository,
        private purchaseSummaryRepository: PurchaseSummaryRepository
    ){}

    async execute(command: SetPurchaseSummaryGeolocationCommand) {
        const purchase = await this.purchaseRepository.findByIdAndCompanyId({
            companyId: command.companyId, id: command.purchaseId
        });

        if (purchase?.address?.latitude) {
            const dailyPurchaseSummary = await this.purchaseSummaryRepository.findByCompanyIdAndDate({
                companyId: command.companyId,
                date: format(new Date(purchase.createdAt), 'yyyy-MM-dd')
            });

            await this.purchaseSummaryRepository.updateLocation({
                dailyPurchaseId: dailyPurchaseSummary.id,
                location: {
                    latitude: purchase.address.latitude,
                    longitude: purchase.address.longitude
                },
                purchase
            })
        }
    }

}