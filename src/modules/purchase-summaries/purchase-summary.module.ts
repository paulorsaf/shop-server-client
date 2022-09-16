import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { AddPurchaseSummaryCommandHandler } from './commands/add-purchase-summary/add-purchase-summary-command.handler';
import { PurchaseSummaryRepository } from './repositories/purchase-summary.repository';
import { PurchaseRepository } from './repositories/purchase.repository';

@Module({
  imports: [
    CqrsModule
  ],
  providers: [
    PurchaseRepository,
    PurchaseSummaryRepository,

    AddPurchaseSummaryCommandHandler
  ]
})
export class PurchaseSummaryModule {}
