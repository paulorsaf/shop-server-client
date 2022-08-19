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

@Module({
  imports: [
    BannersModule,
    CategoriesModule,
    CompanyModule,
    ProductsModule,
    RegisterModule,
    PurchasesModule,
    StockModule
  ],
  providers: [
    EventRepository,
    
    SaveEventHandler
  ]
})
export class AppModule {}
