import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { MakePaymentByCreditCardCommandHandler } from './commands/make-payment-by-credit-card/make-payment-by-credit-card-command.handler';
import { SavePaymentByPixCommandHandler } from './commands/save-payment-by-pix/save-payment-by-pix-command.handler';
import { SavePaymentErrorCommandHandler } from './commands/save-payment-error/save-payment-error-command.handler';
import { SelectPurchasePaymentCommandHandler } from './commands/select-payment/select-purchase-payment-command.handler';
import { PaymentFactory } from './factories/payment.factory';
import { PaymentsController } from './payment.controller';
import { StripeRepository } from './repositories/payment-gateway/stripe/stripe.repository';
import { PurchaseRepository } from './repositories/purchase.repository';
import { StorageRepository } from './repositories/storage.repository';
import { PaymentSagas } from './sagas/payment.saga';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { FindUserCreditCardsQueryHandler } from './queries/find-user-credit-cards/find-user-credit-cards-query.handler';
import { DeleteCreditCardByIdCommandHandler } from './commands/delete-credit-card-by-id/delete-credit-card-by-id-command.handler';
import { MakePaymentBySavedCreditCardCommandHandler } from './commands/make-payment-by-saved-credit-card/make-payment-by-saved-credit-card-command.handler';
import { SavePaymentByMoneyCommandHandler } from './commands/save-payment-by-money/save-payment-by-money.command.handler';

@Module({
  controllers: [
    PaymentsController
  ],
  imports: [
    CqrsModule,
    AuthenticationModule
  ],
  providers: [
    StripeRepository,
    PaymentFactory,
    PurchaseRepository,
    StorageRepository,

    FindUserCreditCardsQueryHandler,
    SavePaymentByMoneyCommandHandler,

    DeleteCreditCardByIdCommandHandler,
    SelectPurchasePaymentCommandHandler,
    SavePaymentByPixCommandHandler,
    SavePaymentErrorCommandHandler,
    MakePaymentByCreditCardCommandHandler,
    MakePaymentBySavedCreditCardCommandHandler,

    PaymentSagas
  ]
})
export class PaymentModule {}
