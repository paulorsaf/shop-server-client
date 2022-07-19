import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { QueryBusMock } from '../../mocks/query-bus.mock';
import { QueryBus } from '@nestjs/cqrs';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { Company } from '../../authentication/model/company';
import { FindProductByIdQuery } from './queries/find-product-by-id/find-product-by-id.query';

describe('ProductsController', () => {
  
  let controller: ProductsController;
  let queryBus: QueryBusMock;

  const company: Company = {id: 'anyCompanyId'} as any;

  beforeEach(async () => {
    queryBus = new QueryBusMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      imports: [
        CqrsModule,
        AuthenticationModule
      ]
    })
    .overrideProvider(QueryBus).useValue(queryBus)
    .compile();

    controller = module.get<ProductsController>(ProductsController);
  });

  describe('given find categories by company', () => {

    it('then execute find categories by company query', async () => {
      await controller.findById(company, 'anyProductId');
  
      expect(queryBus.executedWith).toEqual(
        new FindProductByIdQuery('anyCompanyId', 'anyProductId')
      );
    });

  })

});
