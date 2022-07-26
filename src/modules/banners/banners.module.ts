import { Module } from '@nestjs/common';
import { BannersController } from './banners.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { FindBannersByCompanyQueryHandler } from './commands/find-banners-by-company-query.handler';
import { BannerRepository } from './repositories/banner.repository';
import { ProductRepository } from './repositories/product.repository';

@Module({
  controllers: [
    BannersController
  ],
  imports: [
    CqrsModule,
    AuthenticationModule
  ],
  providers: [
    BannerRepository,
    ProductRepository,

    FindBannersByCompanyQueryHandler
  ]
})
export class BannersModule {}
