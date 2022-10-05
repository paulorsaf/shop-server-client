import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthCompany } from '../../authentication/decorators/company.decorator';
import { CompanyStrategy } from '../../authentication/guards/company.strategy';
import { Company } from '../../authentication/model/company';
import { AuthUser } from '../../authentication/decorators/user.decorator';
import { JwtStrategy } from '../../authentication/guards/jwt.strategy';
import { User } from '../../authentication/model/user';
import { FindUserCreditCardsQuery } from './queries/find-user-credit-cards/find-user-credit-cards.query';
import { DeleteCreditCardByIdCommand } from './commands/delete-credit-card-by-id/delete-credit-card-by-id.command';

@Controller('payments')
export class PaymentsController {

  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus
  ) {}

  @UseGuards(CompanyStrategy, JwtStrategy)
  @Get('creditcards')
  findCreditCards(@AuthCompany() company: Company, @AuthUser() user: User) {
    return this.queryBus.execute(
      new FindUserCreditCardsQuery(company.id, user.email, user.id)
    )
  }

  @UseGuards(CompanyStrategy, JwtStrategy)
  @Delete('creditcards/:id')
  deleteCreditCard(@AuthCompany() company: Company, @AuthUser() user: User, @Param('id') id: string) {
    return this.commandBus.execute(
      new DeleteCreditCardByIdCommand(
        company.id,
        id,
        {
          email: user.email,
          id: user.id
        }
      )
    )
  }

}
