import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AuthCompany } from '../../authentication/decorators/company.decorator';
import { Company } from '../../authentication/model/company';
import { CompanyStrategy } from '../../authentication/guards/company.strategy';
import { FindAddressByZipcodeQuery } from './commands/find-address-by-zipcode/find-address-by-zipcode.query';

@Controller('address/zipcode')
export class AddressController {

  constructor(
    private queryBus: QueryBus
  ) {}

  @UseGuards(CompanyStrategy)
  @Get(':zipCode')
  findByZipCode(@AuthCompany() company: Company, @Param('zipCode') zipCode: string) {
    return this.queryBus.execute(
      new FindAddressByZipcodeQuery(
        zipCode
      )
    )
  }

}
