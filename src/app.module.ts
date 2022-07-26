import { Module } from '@nestjs/common';
import { BannersModule } from './modules/banners/banners.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';

@Module({
  imports: [
    BannersModule,
    CategoriesModule,
    ProductsModule
  ]
})
export class AppModule {}
