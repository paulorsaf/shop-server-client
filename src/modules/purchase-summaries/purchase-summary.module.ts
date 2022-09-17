import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AddPurchaseSummaryCommandHandler } from './commands/add-purchase-summary/add-purchase-summary-command.handler';
import { SetPurchaseSummaryGeolocationCommandHandler } from './commands/set-purchase-summary-geolocation/set-purchase-summary-geolocation-command.handler';
import { SetPurchaseSummaryPaymentErrorCommandHandler } from './commands/set-purchase-summary-payment-error/set-purchase-summary-payment-error-command.handler';
import { SetPurchaseSummaryPaymentSuccessCommandHandler } from './commands/set-purchase-summary-payment-success/set-purchase-summary-payment-success-command.handler';
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
    SetPurchaseSummaryPaymentErrorCommandHandler,
    SetPurchaseSummaryPaymentSuccessCommandHandler,
    SetPurchaseSummaryGeolocationCommandHandler
  ]
})
export class PurchaseSummaryModule {}
