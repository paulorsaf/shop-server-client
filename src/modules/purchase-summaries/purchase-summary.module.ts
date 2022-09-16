import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AddPurchaseSummaryCommandHandler } from './commands/add-purchase-summary/add-purchase-summary-command.handler';
import { SetPurchaseSummaryPaymentErrorCommandHandler } from './commands/set-purchase-summary-payment-error/set-purchase-summary-payment-error-command.handler';
import { PurchaseSummaryRepository } from './repositories/purchase-summary.repository';
import { PurchaseRepository } from './repositories/purchase.repository';

@Module({
  imports: [
    CqrsModule
  ],
  providers: [
    PurchaseRepository,
    PurchaseSummaryRepository,

    AddPurchaseSummaryCommandHandler,
    SetPurchaseSummaryPaymentErrorCommandHandler
  ]
})
export class PurchaseSummaryModule {}
