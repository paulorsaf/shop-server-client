import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SendNewPurchaseEmailToClientCommandHandler } from './commands/send-new-purchase-email-to-client/send-new-purchase-email-to-client-command.handler';
import { SendNewPurchaseEmailToCompanyCommandHandler } from './commands/send-new-purchase-email-to-company/send-new-purchase-email-to-company-command.handler';
import { SendPaymentSuccessEmailToClientCommandHandler } from './commands/send-payment-success-email-to-client/send-payment-success-email-to-client-command.handler';
import { EmailRepository } from './repositories/email.repository';
import { PurchaseRepository } from './repositories/purchase.repository';

@Module({
  imports: [
    CqrsModule
  ],
  providers: [
    EmailRepository,
    PurchaseRepository,

    SendNewPurchaseEmailToCompanyCommandHandler,
    SendNewPurchaseEmailToClientCommandHandler,
    SendPaymentSuccessEmailToClientCommandHandler
  ]
})
export class EmailModule {}
