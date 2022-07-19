import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { CategoryRepositoryMock } from '../../../../mocks/category-repository.mock';
import { Category } from '../../entity/category';
import { CategoryRepository } from '../../repositories/category.repository';
import { FindCategoriesByCompanyQueryHandler } from './find-categories-by-company-query.handler';
import { FindCategoriesByCompany } from './find-categories-by-company.query';

describe('FindCategoriesByCompanyQueryHandler', () => {

  let handler: FindCategoriesByCompanyQueryHandler;
  let categoryRepository: CategoryRepositoryMock;

  const command = new FindCategoriesByCompany('anyCompanyId');

  beforeEach(async () => {
    categoryRepository = new CategoryRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        FindCategoriesByCompanyQueryHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        CategoryRepository
      ]
    })
    .overrideProvider(CategoryRepository).useValue(categoryRepository)
    .compile();

    handler = module.get<FindCategoriesByCompanyQueryHandler>(FindCategoriesByCompanyQueryHandler);
  });

  it('given execute handler, then find categories by company', async () => {
    const categories = [
      new Category('anyId1', 'anyName1'),
      new Category('anyId2', 'anyName2')
    ];
    categoryRepository.response = categories;

    const response = await handler.execute(command);

    expect(response).toEqual(categories);
  });

});
