import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SavePaymentByPixCommandHandler } from './commands/save-payment-by-pix/save-payment-by-pix-command.handler';
import { SavePaymentErrorCommandHandler } from './commands/save-payment-error/save-payment-error-command.handler';
import { SelectPurchasePaymentCommandHandler } from './commands/select-payment/select-purchase-payment-command.handler';
import { PurchaseRepository } from './repositories/purchase.repository';
import { PaymentSagas } from './sagas/payment.saga';

@Module({
  imports: [
    CqrsModule
  ],
  providers: [
    PurchaseRepository,

    SelectPurchasePaymentCommandHandler,
    SavePaymentByPixCommandHandler,
    SavePaymentErrorCommandHandler,

    PaymentSagas
  ]
})
export class PaymentModule {}
