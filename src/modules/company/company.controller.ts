import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthCompany } from '../../authentication/decorators/company.decorator';
import { Company } from '../../authentication/model/company';
import { CompanyStrategy } from '../../authentication/guards/company.strategy';
import { QueryBus } from '@nestjs/cqrs';
import { FindCompanyByIdQuery } from './queries/find-company-by-id.query';

@Controller('companies')
export class CompanyController {

  constructor(
    private queryBus: QueryBus
  ){}

  @UseGuards(CompanyStrategy)
  @Get()
  find(@AuthCompany() company: Company) {
    return company;
  }

  @Get(":id")
  findById(@Param("id") id: string) {
    return this.queryBus.execute(
      new FindCompanyByIdQuery(id)
    )
  }

}
