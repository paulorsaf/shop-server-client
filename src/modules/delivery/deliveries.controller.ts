import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AuthCompany } from '../../authentication/decorators/company.decorator';
import { Company } from '../../authentication/model/company';
import { CompanyStrategy } from '../../authentication/guards/company.strategy';
import { FindDeliveryPriceByZipCodeQuery } from './queries/find-delivery-price-by-zipcode/find-delivery-price-by-zipcode.query';
import { ProductDTO } from './dtos/product.dto';

@Controller('deliveries')
export class DeliveriesController {

  constructor(
    private queryBus: QueryBus
  ) {}

  @UseGuards(CompanyStrategy)
  @Post(':zipCode')
  findByZipCode(
    @AuthCompany() company: Company,
    @Param('zipCode') zipCode: string,
    @Body() products: ProductDTO[]
  ) {
    return this.queryBus.execute(
      new FindDeliveryPriceByZipCodeQuery(
        {
          address: company.address,
          cityDeliveryPrice: company.cityDeliveryPrice,
          hasDeliveryByMail: company.hasDeliveryByMail
        },
        zipCode,
        products
      )
    )
  }

  @UseGuards(CompanyStrategy)
  @Get(':zipCode')
  findByZipCodeOld(
    @AuthCompany() company: Company,
    @Param('zipCode') zipCode: string
  ) {
    return this.queryBus.execute(
      new FindDeliveryPriceByZipCodeQuery(
        {
          address: company.address,
          cityDeliveryPrice: company.cityDeliveryPrice,
          hasDeliveryByMail: company.hasDeliveryByMail
        },
        zipCode,
        []
      )
    )
  }

}
