import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SendNewPurchaseEmailToCompanyCommandHandler } from './commands/send-new-purchase-email-to-company/send-new-purchase-email-to-company-command.handler';
import { EmailRepository } from './repositories/email.repository';
import { PurchaseRepository } from './repositories/purchase.repository';

@Module({
  imports: [
    CqrsModule
  ],
  providers: [
    EmailRepository,
    PurchaseRepository,

    SendNewPurchaseEmailToCompanyCommandHandler
  ]
})
export class EmailModule {}
