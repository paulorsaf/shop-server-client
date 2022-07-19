import { Module } from '@nestjs/common';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProductsModule } from './modules/products/products.module';

@Module({
  imports: [
    CategoriesModule,
    ProductsModule
  ]
})
export class AppModule {}
