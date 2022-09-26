import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthCompany } from '../../authentication/decorators/company.decorator';
import { Company } from '../../authentication/model/company';
import { CompanyStrategy } from '../../authentication/guards/company.strategy';
import { QueryBus } from '@nestjs/cqrs';
import { FindCupomQuery } from './queries/find-cupom/find-cupom.query';

@Controller('cupoms')
export class CupomsController {

  constructor(
    private queryBus: QueryBus
  ){}

  @UseGuards(CompanyStrategy)
  @Get(':cupom')
  findByCupom(@AuthCompany() company: Company, @Param('cupom') cupom: string) {
    return this.queryBus.execute(
      new FindCupomQuery(
        company.id,
        cupom
      )
    );
  }

}
