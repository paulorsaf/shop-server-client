import { NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { format } from "date-fns";
import { DailyPurchasesSummary, PurchaseSummary } from "../../models/daily-purchases-summary.model";
import { Purchase } from "../../models/purchase.model";
import { PurchaseSummaryRepository } from "../../repositories/purchase-summary.repository";
import { PurchaseRepository } from "../../repositories/purchase.repository";
import { AddPurchaseSummaryCommand } from "./add-purchase-summary.command";

@CommandHandler(AddPurchaseSummaryCommand)
export class AddPurchaseSummaryCommandHandler implements ICommandHandler<AddPurchaseSummaryCommand> {

    constructor(
        private purchaseRepository: PurchaseRepository,
        private purchaseSummaryRepository: PurchaseSummaryRepository
    ){}

    async execute(command: AddPurchaseSummaryCommand) {
        const purchase = await this.findPurchase(command);

        if (purchase) {
            const dailyPurchaseSummary = await this.purchaseSummaryRepository.findByCompanyIdAndDate({
                companyId: command.companyId, date: format(new Date(), 'yyyy-MM-dd')
            });
            if (dailyPurchaseSummary) {
                const purchaseSummary = this.createPurchaseSummary(purchase);
                await this.purchaseSummaryRepository.add(dailyPurchaseSummary.id, purchaseSummary);
            } else {
                const newDailyPurchaseSummary = this.createDailyPurchaseSummary(purchase);
                await this.purchaseSummaryRepository.create(newDailyPurchaseSummary);
            }
        }
    }

    private async findPurchase(command: AddPurchaseSummaryCommand) {
        return await this.purchaseRepository.findByIdAndCompanyId({
            companyId: command.companyId, id: command.purchaseId
        });
    }

    private createDailyPurchaseSummary(purchase: Purchase) {
        return new DailyPurchasesSummary({
            companyId: purchase.companyId,
            date: format(new Date(), 'yyyy-MM-dd'),
            purchases: {
                [purchase.id]: this.createPurchaseSummary(purchase)
            }
        })
    }

    private createPurchaseSummary(purchase: Purchase): PurchaseSummary {
        return {
            createdAt: purchase.createdAt,
            id: purchase.id,
            payment: purchase.payment ? {
                cupom: purchase.payment.cupom,
                error: purchase.payment.error,
                type: purchase.payment.type
            } : undefined,
            price: purchase.price.totalWithPaymentFee,
            products: purchase.products.map(p => ({
                amount: p.amount,
                id: p.id,
                name: p.name,
                price: p.price,
                priceWithDiscount: p.priceWithDiscount
            })),
            status: purchase.status,
            user: {
                email: purchase.user.email,
                id: purchase.user.id
            }
        }
    }

}