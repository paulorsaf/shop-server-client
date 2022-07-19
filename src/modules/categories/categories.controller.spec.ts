import { Test, TestingModule } from '@nestjs/testing';
import { CategoriesController } from './categories.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { QueryBusMock } from '../../mocks/query-bus.mock';
import { QueryBus } from '@nestjs/cqrs';
import { FindCategoriesByCompany } from './queries/find-categories/find-categories-by-company.query';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { Company } from '../../authentication/model/company';

describe('CategoriesController', () => {
  
  let controller: CategoriesController;
  let queryBus: QueryBusMock;

  const company: Company = {id: 'anyCompanyId'} as any;

  beforeEach(async () => {
    queryBus = new QueryBusMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CategoriesController],
      imports: [
        CqrsModule,
        AuthenticationModule
      ]
    })
    .overrideProvider(QueryBus).useValue(queryBus)
    .compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  describe('given find categories by company', () => {

    it('then execute find categories by company query', async () => {
      await controller.findByCompany(company);
  
      expect(queryBus.executedWith).toEqual(
        new FindCategoriesByCompany('anyCompanyId')
      );
    });

  })

});
