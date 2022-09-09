import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MakePaymentByCreditCardCommandHandler } from './commands/make-payment-by-credit-card/make-payment-by-credit-card-command.handler';
import { SavePaymentByPixCommandHandler } from './commands/save-payment-by-pix/save-payment-by-pix-command.handler';
import { SavePaymentErrorCommandHandler } from './commands/save-payment-error/save-payment-error-command.handler';
import { SelectPurchasePaymentCommandHandler } from './commands/select-payment/select-purchase-payment-command.handler';
import { PaymentFactory } from './factories/payment.factory';
import { StripeRepository } from './repositories/payment-gateway/stripe.repository';
import { PurchaseRepository } from './repositories/purchase.repository';
import { StorageRepository } from './repositories/storage.repository';
import { PaymentSagas } from './sagas/payment.saga';

@Module({
  imports: [
    CqrsModule
  ],
  providers: [
    StripeRepository,
    PaymentFactory,
    PurchaseRepository,
    StorageRepository,

    SelectPurchasePaymentCommandHandler,
    SavePaymentByPixCommandHandler,
    SavePaymentErrorCommandHandler,
    MakePaymentByCreditCardCommandHandler,

    PaymentSagas
  ]
})
export class PaymentModule {}
