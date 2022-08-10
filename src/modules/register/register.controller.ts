import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CompanyStrategy } from '../../authentication/guards/company.strategy';
import { AuthCompany } from '../../authentication/decorators/company.decorator';
import { Company } from '../../authentication/model/company';
import { RegisterUserCommand } from './commands/register-user.command';
import { UserRegister } from './dtos/user-register.dto';

@Controller('register')
export class RegisterController {

  constructor(
    private commandBus: CommandBus
  ) {}

  @UseGuards(CompanyStrategy)
  @Post()
  register(@AuthCompany() company: Company, @Body() userRegister: UserRegister) {
    return this.commandBus.execute(
      new RegisterUserCommand(
        company.id, userRegister.cpfCnpj, userRegister.email, userRegister.name, userRegister.password,
        userRegister.phone
      )
    )
  }

}
