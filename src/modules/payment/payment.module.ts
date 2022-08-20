import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { SavePaymentByPixCommandHandler } from './commands/save-payment-by-pix/save-payment-by-pix-command.handler';
import { SelectPurchasePaymentCommandHandler } from './commands/select-payment/select-purchase-payment-command.handler';
import { PaymentSagas } from './sagas/payment.saga';

@Module({
  imports: [
    CqrsModule
  ],
  providers: [
    SelectPurchasePaymentCommandHandler,
    SavePaymentByPixCommandHandler,

    PaymentSagas
  ]
})
export class PaymentModule {}
