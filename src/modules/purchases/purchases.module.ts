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
import { CalculatePurchasePriceQueryHandler } from './queries/calculate-purchase-price/calculate-purchase-price-query.handler';
import { DeliveryRepository } from '../../repositories/delivery.repository';
import { DeliveryService } from '../../services/delivery.service';
import { AddressRepository } from '../../repositories/address.repository';
import { FindLastPurchaseByCompanyAndUserIdQueryHandler } from './queries/find-last-purchase-by-company-and-user-id/find-last-purchase-by-company-and-user-id-query.handler';
import { CupomRepository } from './repositories/cupom.repository';

@Module({
  controllers: [PurchasesController],
  imports: [
    CqrsModule,
    AuthenticationModule
  ],
  providers: [
    AddressRepository,
    CupomRepository,
    DeliveryRepository,
    DeliveryService,
    ProductRepository,
    PurchaseRepository,

    CreatePurchaseCommandHandler,
    RetryPurchasePaymentCommandHandler,

    FindPurchasesByUserAndCompanyQueryHandler,
    FindPurchaseByIdQueryHandler,
    FindLastPurchaseByCompanyAndUserIdQueryHandler,

    CalculatePurchasePriceQueryHandler,

    PurchaseSagas
  ]
})
export class PurchasesModule {}
