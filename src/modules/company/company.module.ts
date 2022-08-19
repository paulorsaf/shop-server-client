import { Module } from '@nestjs/common';
import { CompanyController } from './company.controller';
import { AuthenticationModule } from '../../authentication/authentication.module';

@Module({
  controllers: [CompanyController],
  imports: [
    AuthenticationModule
  ]
})
export class CompanyModule {}
