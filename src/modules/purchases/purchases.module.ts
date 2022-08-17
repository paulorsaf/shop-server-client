import { Module } from '@nestjs/common';
import { PurchasesController } from './purchases.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { CreatePurchaseCommandHandler } from './commands/create-purchase/create-purchase-command.handler';
import { ProductRepository } from './repositories/product.repository';
import { PurchaseSagas } from './sagas/purchases.saga';

@Module({
  controllers: [PurchasesController],
  imports: [
    CqrsModule,
    AuthenticationModule
  ],
  providers: [
    ProductRepository,

    CreatePurchaseCommandHandler,

    PurchaseSagas
  ]
})
export class PurchasesModule {}
