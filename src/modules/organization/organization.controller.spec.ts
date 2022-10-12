import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationController } from './organization.controller';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { Company } from '../../authentication/model/company';
import { CqrsModule, QueryBus } from '@nestjs/cqrs';
import { QueryBusMock } from '../../mocks/query-bus.mock';
import { FindOrganizationByIdQuery } from './queries/find-organization-by-id.query';

describe('OrganizationController', () => {
  
  let controller: OrganizationController;
  let queryBus: QueryBusMock;

  const company: Company = {id: 'anyCompanyId'} as any;

  beforeEach(async () => {
    queryBus = new QueryBusMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrganizationController],
      imports: [
        AuthenticationModule,
        CqrsModule
      ]
    })
    .overrideProvider(QueryBus).useValue(queryBus)
    .compile();

    controller = module.get<OrganizationController>(OrganizationController);
  });

  it('given find by id, then execute find organization by id query', async () => {
    await controller.findById("anyOrganizationId");

    expect(queryBus.executedWith).toEqual(
      new FindOrganizationByIdQuery("anyOrganizationId")
    );
  })

});
