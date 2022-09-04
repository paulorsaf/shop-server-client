import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AuthCompany } from '../../authentication/decorators/company.decorator';
import { Company } from '../../authentication/model/company';
import { CompanyStrategy } from '../../authentication/guards/company.strategy';
import { FindDeliveryPriceByZipCodeQuery } from './queries/find-delivery-price-by-zipcode/find-delivery-price-by-zipcode.query';

@Controller('deliveries')
export class DeliveriesController {

  constructor(
    private queryBus: QueryBus
  ) {}

  @UseGuards(CompanyStrategy)
  @Get(':zipCode')
  findByZipCode(@AuthCompany() company: Company, @Param('zipCode') zipCode: string) {
    return this.queryBus.execute(
      new FindDeliveryPriceByZipCodeQuery(
        {address: company.address, cityDeliveryPrice: company.cityDeliveryPrice},
        zipCode
      )
    )
  }

}
