import { Test, TestingModule } from '@nestjs/testing';
import { PaymentsController } from './payment.controller';
import { CqrsModule, QueryBus } from '@nestjs/cqrs';
import { CommandBus } from '@nestjs/cqrs';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { CommandBusMock } from '../../mocks/command-bus.mock';
import { User } from '../../authentication/model/user';
import { QueryBusMock } from '../../mocks/query-bus.mock';
import { FindUserCreditCardsQuery } from './queries/find-user-credit-cards/find-user-credit-cards.query';
import { DeleteCreditCardByIdCommand } from './commands/delete-credit-card-by-id/delete-credit-card-by-id.command';

describe('PaymentsController', () => {
  
  let controller: PaymentsController;
  let commandBus: CommandBusMock;
  let queryBus: QueryBusMock;

  const company = {id: "anyCompanyId"} as any;
  const user: User = {email: "any@email.com", id: "anyUserId"} as any;

  beforeEach(async () => {
    commandBus = new CommandBusMock();
    queryBus = new QueryBusMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      imports: [
        CqrsModule,
        AuthenticationModule
      ]
    })
    .overrideProvider(CommandBus).useValue(commandBus)
    .overrideProvider(QueryBus).useValue(queryBus)
    .compile();

    controller = module.get<PaymentsController>(PaymentsController);
  });

  it('given find credit cards, then execute find credit cards query', async () => {
    await controller.findCreditCards(company, user);

    expect(queryBus.executedWith).toEqual(
      new FindUserCreditCardsQuery("anyCompanyId", "any@email.com", "anyUserId")
    );
  })

  it('given delete credit card, then execute delete credit card by id command', async () => {
    await controller.deleteCreditCard(company, user, "anyCardId");

    expect(commandBus.executed).toEqual(
      new DeleteCreditCardByIdCommand(
        "anyCompanyId", "anyCardId", {
          email: "any@email.com",
          id: "anyUserId"
        }
      )
    );
  })

});
