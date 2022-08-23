import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthCompany } from '../../authentication/decorators/company.decorator';
import { Company } from '../../authentication/model/company';
import { CompanyStrategy } from '../../authentication/guards/company.strategy';

@Controller('companies')
export class CompanyController {

  @UseGuards(CompanyStrategy)
  @Get()
  find(@AuthCompany() company: Company) {
    return company;
  }

}
