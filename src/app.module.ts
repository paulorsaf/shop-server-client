import { Module } from '@nestjs/common';
import { SaveEventHandler } from './events/save-event-event.handler';
import { BannersModule } from './modules/banners/banners.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';
import { RegisterModule } from './modules/register/register.module';
import { EventRepository } from './repositories/event.repository';

@Module({
  imports: [
    BannersModule,
    CategoriesModule,
    ProductsModule,
    RegisterModule
  ],
  providers: [
    EventRepository,
    
    SaveEventHandler
  ]
})
export class AppModule {}
