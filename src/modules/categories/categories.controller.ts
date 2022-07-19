import { Controller, Get, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AuthCompany } from '../../authentication/decorators/company.decorator';
import { Company } from '../../authentication/model/company';
import { FindCategoriesByCompany } from './queries/find-categories/find-categories-by-company.query';
import { CompanyStrategy } from '../../authentication/guards/company.strategy';

@Controller('categories')
export class CategoriesController {

  constructor(
    private queryBus: QueryBus
  ) {}

  @UseGuards(CompanyStrategy)
  @Get()
  findByCompany(@AuthCompany() company: Company) {
    return this.queryBus.execute(
      new FindCategoriesByCompany(company.id)
    );
  }

}
