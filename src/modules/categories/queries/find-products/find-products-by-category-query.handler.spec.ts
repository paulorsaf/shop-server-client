import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductRepositoryMock } from '../../../../mocks/product-repository.mock';
import { Product, ProductImage } from '../../entity/product';
import { ProductRepository } from '../../repositories/product.repository';
import { FindProductsByCategoryQueryHandler } from './find-products-by-category-query.handler';
import { FindProductsByCategoryQuery } from './find-products-by-category.query';

describe('FindProductsByCategoryQueryHandler', () => {

  let handler: FindProductsByCategoryQueryHandler;
  let productRepository: ProductRepositoryMock;

  const command = new FindProductsByCategoryQuery('anyCompanyId', 'anyProductId');

  beforeEach(async () => {
    productRepository = new ProductRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        FindProductsByCategoryQueryHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        ProductRepository
      ]
    })
    .overrideProvider(ProductRepository).useValue(productRepository)
    .compile();

    handler = module.get<FindProductsByCategoryQueryHandler>(FindProductsByCategoryQueryHandler);
  });

  it('given execute handler, then find products by category', async () => {
    const products = [
      new Product('anyId1', 'anyName1', 10, 8, new ProductImage('anyFileName', 'anyUrl'), "anyUnit", 10),
      new Product('anyId2', 'anyName2', 5, 4, new ProductImage('anyFileName', 'anyUrl'), "anyUnit", 10)
    ];
    productRepository.response = products;

    const response = await handler.execute(command);

    expect(response).toEqual(products);
  });

});
