import { Controller, Get, UseGuards } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { AuthCompany } from '../../authentication/decorators/company.decorator';
import { CompanyStrategy } from '../../authentication/guards/company.strategy';
import { Company } from '../../authentication/model/company';
import { AuthUser } from '../../authentication/decorators/user.decorator';
import { JwtStrategy } from '../../authentication/guards/jwt.strategy';
import { User } from '../../authentication/model/user';
import { FindUserCreditCardsQuery } from './queries/find-user-credit-cards/find-user-credit-cards.query';

@Controller('payments')
export class PaymentsController {

  constructor(
    private queryBus: QueryBus
  ) {}

  @UseGuards(CompanyStrategy, JwtStrategy)
  @Get('creditcards')
  findCreditCards(@AuthCompany() company: Company, @AuthUser() user: User) {
    return this.queryBus.execute(
      new FindUserCreditCardsQuery(company.id, user.email)
    )
  }

}
