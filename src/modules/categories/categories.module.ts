import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { FindCategoriesByCompanyQueryHandler } from './queries/find-categories/find-categories-by-company-query.handler';
import { CategoryRepository } from './repositories/category.repository';

@Module({
  controllers: [CategoriesController],
  imports: [
    CqrsModule,
    AuthenticationModule
  ],
  providers: [
    CategoryRepository,

    FindCategoriesByCompanyQueryHandler
  ]
})
export class CategoriesModule {}
