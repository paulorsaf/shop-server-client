import { NotFoundException } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductRepositoryMock } from '../../../../mocks/product-repository.mock';
import { Product, ProductImage } from '../../entity/product';
import { ProductRepository } from '../../repositories/product.repository';
import { FindProductByIdQueryHandler } from './find-product-by-id-query.handler';
import { FindProductByIdQuery } from './find-product-by-id.query';

describe('FindProductByIdQueryHandler', () => {

  let handler: FindProductByIdQueryHandler;
  let productRepository: ProductRepositoryMock;

  const command = new FindProductByIdQuery('anyCompanyId', 'anyProductId');

  beforeEach(async () => {
    productRepository = new ProductRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        FindProductByIdQueryHandler
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

    handler = module.get<FindProductByIdQueryHandler>(FindProductByIdQueryHandler);
  });

  it('given find product by id, then return product', async () => {
    const product = {id: 'anyId', companyId: "anyCompanyId"} as any;
    productRepository.response = product;

    const response = await handler.execute(command);

    expect(response).toEqual(product);
  });

  it('given find product by id, when no product found, then throw not found exception', async () => {
    await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
  });

  it('given find product by id, when product doesnt belong to company, then throw not found exception', async () => {
    const product = {id: 'anyId', companyId: "anyOtherCompanyId"} as any;
    productRepository.response = product;

    await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
  });

});
