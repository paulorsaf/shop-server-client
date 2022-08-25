import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { CqrsModule } from '@nestjs/cqrs';
import { FindCompanyByIdQueryHandler } from './queries/find-company-by-id-query.handler';
import { CompanyRepository } from './repositories/company.repository';

@Module({
  controllers: [
    CompanyController
  ],
  imports: [
    CqrsModule,
    AuthenticationModule
  ],
  providers: [
    CompanyRepository,

    FindCompanyByIdQueryHandler
  ]
})
export class CompanyModule {}
