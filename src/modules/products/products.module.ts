import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { FindProductByIdQueryHandler } from './queries/find-product-by-id/find-product-by-id-query.handler';
import { ProductRepository } from './repositories/product.repository';
import { StockRepository } from './repositories/stock.repository';

@Module({
  controllers: [ProductsController],
  imports: [
    CqrsModule,
    AuthenticationModule
  ],
  providers: [
    ProductRepository,
    StockRepository,

    FindProductByIdQueryHandler
  ]
})
export class ProductsModule {}
