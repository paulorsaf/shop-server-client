import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from './company.controller';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { Company } from '../../authentication/model/company';

describe('CompanyController', () => {
  
  let controller: CompanyController;

  const company: Company = {id: 'anyCompanyId'} as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      imports: [
        AuthenticationModule
      ]
    })
    .compile();

    controller = module.get<CompanyController>(CompanyController);
  });

  it('given find company, then return company', async () => {
    const response = await controller.find(company);

    expect(response).toEqual(company)
  })

});
