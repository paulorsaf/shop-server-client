import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AuthCompany } from '../../authentication/decorators/company.decorator';
import { Company } from '../../authentication/model/company';
import { CompanyStrategy } from '../../authentication/guards/company.strategy';
import { FindProductByIdQuery } from './queries/find-product-by-id/find-product-by-id.query';

@Controller('products')
export class ProductsController {

  constructor(
    private queryBus: QueryBus
  ) {}

  @UseGuards(CompanyStrategy)
  @Get(':productId')
  findById(@AuthCompany() company: Company, @Param('productId') productId: string) {
    return this.queryBus.execute(
      new FindProductByIdQuery(
        company.id, productId
      )
    )
  }

}
