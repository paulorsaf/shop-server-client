import { Module } from '@nestjs/common';
import { RegisterController } from './register.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { UserRepository } from './repositories/user.repository';
import { AuthRepository } from './repositories/auth.repository';
import { CompanyRepository } from 'src/authentication/repositories/company/company.repository';
import { RegisterUserCommandHandler } from './commands/register-user-command.handler';

@Module({
  controllers: [RegisterController],
  imports: [
    CqrsModule
  ],
  providers: [
    AuthRepository,
    CompanyRepository,
    UserRepository,

    RegisterUserCommandHandler
  ]
})
export class RegisterModule {}
