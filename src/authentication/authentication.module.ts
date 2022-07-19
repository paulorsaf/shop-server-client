import { Module } from '@nestjs/common';
import { CompanyRepository } from './repositories/company/company.repository';
import { TokenRepository } from './repositories/token/token.repository';
import { UserRepository } from './repositories/user/user.repository';
import { AuthorizationService } from './services/auth/authorization.service';

@Module({
  exports: [
    AuthorizationService,
    CompanyRepository,
    TokenRepository,
    UserRepository
  ],
  providers: [
    AuthorizationService,
    CompanyRepository,
    TokenRepository,
    UserRepository
  ]
})
export class AuthenticationModule {}
