import { Test, TestingModule } from '@nestjs/testing';
import { CupomsController } from './cupoms.controller';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { Company } from '../../authentication/model/company';
import { FindCupomQuery } from './queries/find-cupom/find-cupom.query';
import { CqrsModule, QueryBus } from '@nestjs/cqrs';
import { QueryBusMock } from '../../mocks/query-bus.mock';

describe('CupomsController', () => {
  
  let controller: CupomsController;
  let queryBus: QueryBusMock;

  const company: Company = {id: 'anyCompanyId'} as any;

  beforeEach(async () => {
    queryBus = new QueryBusMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CupomsController],
      imports: [
        AuthenticationModule,
        CqrsModule
      ]
    })
    .overrideProvider(QueryBus).useValue(queryBus)
    .compile();

    controller = module.get<CupomsController>(CupomsController);
  });

  it('given find cupom, then return cupom', async () => {
    await controller.findByCupom(company, "anyCupomId");

    expect(queryBus.executedWith).toEqual(
      new FindCupomQuery(
        "anyCompanyId",
        "anyCupomId"
      )
    );
  })

});
