import { Module } from '@nestjs/common';
import { PurchasesController } from './purchases.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { CreatePurchaseCommandHandler } from './commands/create-purchase/create-purchase-command.handler';
import { ProductRepository } from './repositories/product.repository';
import { PurchaseSagas } from './sagas/purchases.saga';
import { FindPurchasesByUserAndCompanyQueryHandler } from './queries/find-all/find-purchases-by-user-and-company-query.handler';
import { PurchaseRepository } from './repositories/purchase.repository';
import { RetryPurchasePaymentCommandHandler } from './commands/retry-purchase-payment/retry-purchase-payment-command.handler';
import { FindPurchaseByIdQueryHandler } from './queries/find-by-id/find-purchase-by-id-query.handler';

@Module({
  controllers: [PurchasesController],
  imports: [
    CqrsModule,
    AuthenticationModule
  ],
  providers: [
    ProductRepository,
    PurchaseRepository,

    CreatePurchaseCommandHandler,
    RetryPurchasePaymentCommandHandler,

    FindPurchasesByUserAndCompanyQueryHandler,
    FindPurchaseByIdQueryHandler,

    PurchaseSagas
  ]
})
export class PurchasesModule {}
