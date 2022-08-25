import { Test, TestingModule } from '@nestjs/testing';
import { CompanyController } from './company.controller';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { Company } from '../../authentication/model/company';
import { FindCompanyByIdQuery } from './queries/find-company-by-id.query';
import { CqrsModule, QueryBus } from '@nestjs/cqrs';
import { QueryBusMock } from '../../mocks/query-bus.mock';

describe('CompanyController', () => {
  
  let controller: CompanyController;
  let queryBus: QueryBusMock;

  const company: Company = {id: 'anyCompanyId'} as any;

  beforeEach(async () => {
    queryBus = new QueryBusMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CompanyController],
      imports: [
        AuthenticationModule,
        CqrsModule
      ]
    })
    .overrideProvider(QueryBus).useValue(queryBus)
    .compile();

    controller = module.get<CompanyController>(CompanyController);
  });

  it('given find company, then return company', async () => {
    const response = await controller.find(company);

    expect(response).toEqual(company)
  })

  it('given find company id, then execute find company by id query', async () => {
    await controller.findById("anyCompanyId");

    expect(queryBus.executedWith).toEqual(
      new FindCompanyByIdQuery("anyCompanyId")
    );
  })

});
