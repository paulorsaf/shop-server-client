import { Module } from '@nestjs/common';
import { CompanyRepository } from './repositories/company/company.repository';
import { TokenRepository } from './repositories/token/token.repository';
import { UserRepository } from './repositories/user/user.repository';
import { AuthService } from './services/auth/auth.service';

@Module({
  exports: [
    AuthService,
    CompanyRepository,
    TokenRepository,
    UserRepository
  ],
  providers: [
    AuthService,
    CompanyRepository,
    TokenRepository,
    UserRepository
  ]
})
export class AuthenticationModule {}
