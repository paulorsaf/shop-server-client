import { Module } from '@nestjs/common';
import { SaveEventHandler } from './events/save-event-event.handler';
import { BannersModule } from './modules/banners/banners.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';
import { RegisterModule } from './modules/register/register.module';
import { PurchasesModule } from './modules/purchases/purchases.module';
import { EventRepository } from './repositories/event.repository';
import { StockModule } from './modules/stocks/stock.module';
import { CompanyModule } from './modules/company/company.module';
import { PaymentModule } from './modules/payment/payment.module';
import { EmailModule } from './modules/email/email.module';
import { AddressModule } from './modules/address/address.module';
import { DeliveriesModule } from './modules/delivery/deliveries.module';
import { SentryModule } from '@ntegral/nestjs-sentry';
import { LogLevel } from '@nestjs/common/services/logger.service';

@Module({
  imports: [
    AddressModule,
    BannersModule,
    CategoriesModule,
    CompanyModule,
    DeliveriesModule,
    EmailModule,
    ProductsModule,
    RegisterModule,
    PurchasesModule,
    PaymentModule,
    StockModule,

    SentryModule.forRoot({
      dsn: process.env.SENTRY_DNS,
      environment: 'production',
      logLevels: ["error"],
      release: "1.0.0"
    })
  ],
  providers: [
    EventRepository,
    
    SaveEventHandler
  ]
})
export class AppModule {}
