import { NotFoundException } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { StockRepositoryMock } from '../../../../mocks/stock-repository.mock';
import { ProductRepositoryMock } from '../../../../mocks/product-repository.mock';
import { ProductRepository } from '../../repositories/product.repository';
import { FindProductByIdQueryHandler } from './find-product-by-id-query.handler';
import { FindProductByIdQuery } from './find-product-by-id.query';
import { StockRepository } from '../../repositories/stock.repository';
import { ProductStock } from '../../entity/stock';

describe('FindProductByIdQueryHandler', () => {

  let handler: FindProductByIdQueryHandler;
  let productRepository: ProductRepositoryMock;
  let stockRepository: StockRepositoryMock;

  const command = new FindProductByIdQuery('anyCompanyId', 'anyProductId');

  beforeEach(async () => {
    productRepository = new ProductRepositoryMock();
    stockRepository = new StockRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        FindProductByIdQueryHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        ProductRepository,
        StockRepository
      ]
    })
    .overrideProvider(ProductRepository).useValue(productRepository)
    .overrideProvider(StockRepository).useValue(stockRepository)
    .compile();

    handler = module.get<FindProductByIdQueryHandler>(FindProductByIdQueryHandler);
  });

  it('given find product by id, then return product', async () => {
    const product = {id: 'anyId', companyId: "anyCompanyId"} as any;
    productRepository.response = product;

    const response = await handler.execute(command);

    expect(response).toEqual(product);
  });

  it('given no product found, then throw not found exception', async () => {
    await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
  });

  it('given product found, when product doesnt belong to company, then throw not found exception', async () => {
    const product = {id: 'anyId', companyId: "anyOtherCompanyId"} as any;
    productRepository.response = product;

    await expect(handler.execute(command)).rejects.toThrowError(NotFoundException);
  });

  it('given product found, when product has stock, then add stock details to product', async () => {
    const product = {id: 'anyId', companyId: "anyCompanyId"} as any;
    productRepository.response = product;
    const stock = [new ProductStock('anyColor', 'anyId', 10, 'anySize')];
    stockRepository.response = stock;

    const response = await handler.execute(command);

    expect(response).toEqual({...product, stock});
  });

});
