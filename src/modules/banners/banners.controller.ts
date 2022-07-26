import { Controller, Get, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AuthCompany } from '../../authentication/decorators/company.decorator';
import { Company } from '../../authentication/model/company';
import { CompanyStrategy } from '../../authentication/guards/company.strategy';
import { FindBannersByCompanyQuery } from './commands/find-banners-by-company.query';

@Controller('banners')
export class BannersController {

  constructor(
    private queryBus: QueryBus
  ) {}

  @UseGuards(CompanyStrategy)
  @Get()
  find(@AuthCompany() company: Company) {
    return this.queryBus.execute(
      new FindBannersByCompanyQuery(
        company.id
      )
    )
  }

}
