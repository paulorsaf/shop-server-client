import { Module } from '@nestjs/common';
import { OrganizationController } from './organization.controller';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { CqrsModule } from '@nestjs/cqrs';
import { FindOrganizationByIdQueryHandler } from './queries/find-organization-by-id-query.handler';
import { OrganizationRepository } from './repositories/organization.repository';

@Module({
  controllers: [
    OrganizationController
  ],
  imports: [
    CqrsModule,
    AuthenticationModule
  ],
  providers: [
    OrganizationRepository,
    
    FindOrganizationByIdQueryHandler
  ]
})
export class OrganizationModule {}
