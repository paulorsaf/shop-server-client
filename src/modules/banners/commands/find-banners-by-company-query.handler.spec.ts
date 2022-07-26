import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { ProductRepositoryMock } from '../../../mocks/product-repository.mock';
import { BannerRepositoryMock } from '../../../mocks/banner-repository.mock';
import { Banner } from '../entities/banner';
import { BannerRepository } from '../repositories/banner.repository';
import { BannerDTO } from './dtos/banner.dto';
import { FindBannersByCompanyQueryHandler } from './find-banners-by-company-query.handler';
import { FindBannersByCompanyQuery } from './find-banners-by-company.query';
import { Product } from '../entities/product';
import { ProductRepository } from '../repositories/product.repository';

describe('FindBannersByCompanyQueryHandler', () => {

  let handler: FindBannersByCompanyQueryHandler;
  let bannerRepository: BannerRepositoryMock;
  let productRepository: ProductRepositoryMock;

  const command = new FindBannersByCompanyQuery('anyCompanyId');

  beforeEach(async () => {
    bannerRepository = new BannerRepositoryMock();
    productRepository = new ProductRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        FindBannersByCompanyQueryHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        BannerRepository,
        ProductRepository
      ]
    })
    .overrideProvider(BannerRepository).useValue(bannerRepository)
    .overrideProvider(ProductRepository).useValue(productRepository)
    .compile();

    handler = module.get<FindBannersByCompanyQueryHandler>(FindBannersByCompanyQueryHandler);
  });

  it('given execute handler, then find categories by company', async () => {
    const banners = [
      new Banner('anyId1', 'anyProductId1'),
      new Banner('anyId2', 'anyProductId2')
    ]
    bannerRepository.response = banners;

    productRepository.response = new Product(
      'anyProductId', [{imageUrl: 'anyImage', fileName: 'anyfileName'}], "anyName", 10, 8
    )

    const response = await handler.execute(command);

    const bannersResponse = [
      new BannerDTO('anyName', 'anyProductId', 'anyImage', 10, 8),
      new BannerDTO('anyName', 'anyProductId', 'anyImage', 10, 8)
    ];
    expect(response).toEqual(bannersResponse);
  });

});
