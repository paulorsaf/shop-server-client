import { Test, TestingModule } from '@nestjs/testing';
import { DeliveriesController } from './deliveries.controller';
import { CqrsModule, QueryBus } from '@nestjs/cqrs';
import { CommandBus } from '@nestjs/cqrs';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { Company } from '../../authentication/model/company';
import { CommandBusMock } from '../../mocks/command-bus.mock';
import { QueryBusMock } from '../../mocks/query-bus.mock';
import { FindDeliveryPriceByZipCodeQuery } from './queries/find-delivery-price-by-zipcode/find-delivery-price-by-zipcode.query';

describe('DeliveriesController', () => {
  
  let controller: DeliveriesController;
  let commandBus: CommandBusMock;
  let queryBus: QueryBusMock;

  const company: Company = {address: "anyAddress", cityDeliveryPrice: 10} as any;

  beforeEach(async () => {
    commandBus = new CommandBusMock();
    queryBus = new QueryBusMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveriesController],
      imports: [
        CqrsModule,
        AuthenticationModule
      ]
    })
    .overrideProvider(CommandBus).useValue(commandBus)
    .overrideProvider(QueryBus).useValue(queryBus)
    .compile();

    controller = module.get<DeliveriesController>(DeliveriesController);
  });

  it('given find address by zip code, then execute find address by zip code query', async () => {
    const products = [{weight: 1, amount: 2}];

    await controller.findByZipCode(company, "anyZipCode", products);

    expect(queryBus.executedWith).toEqual(
      new FindDeliveryPriceByZipCodeQuery(
        {address: "anyAddress" as any, cityDeliveryPrice: 10},
        "anyZipCode",
        products
      )
    )
  })

});

