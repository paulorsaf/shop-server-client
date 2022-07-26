import { Test, TestingModule } from '@nestjs/testing';
import { BannersController } from './banners.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { QueryBusMock } from '../../mocks/query-bus.mock';
import { QueryBus } from '@nestjs/cqrs';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { Company } from '../../authentication/model/company';
import { FindBannersByCompanyQuery } from './commands/find-banners-by-company.query';

describe('BannersController', () => {
  
  let controller: BannersController;
  let queryBus: QueryBusMock;

  const company: Company = {id: 'anyCompanyId'} as any;

  beforeEach(async () => {
    queryBus = new QueryBusMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [BannersController],
      imports: [
        CqrsModule,
        AuthenticationModule
      ]
    })
    .overrideProvider(QueryBus).useValue(queryBus)
    .compile();

    controller = module.get<BannersController>(BannersController);
  });

  describe('given find categories by company', () => {

    it('then execute find categories by company query', async () => {
      await controller.find(company);
  
      expect(queryBus.executedWith).toEqual(
        new FindBannersByCompanyQuery('anyCompanyId')
      );
    });

  })

});
