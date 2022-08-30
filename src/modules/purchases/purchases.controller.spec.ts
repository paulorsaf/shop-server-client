import { Test, TestingModule } from '@nestjs/testing';
import { PurchasesController } from './purchases.controller';
import { CqrsModule, QueryBus } from '@nestjs/cqrs';
import { CommandBus } from '@nestjs/cqrs';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { Company } from '../../authentication/model/company';
import { CommandBusMock } from '../../mocks/command-bus.mock';
import { User } from '../../authentication/model/user';
import { CreatePurchaseCommand } from './commands/create-purchase/create-purchase.command';
import { QueryBusMock } from '../../mocks/query-bus.mock';
import { FindPurchasesByUserAndCompanyQuery } from './queries/find-all/find-purchases-by-user-and-company.query';
import { RetryPaymentDTO, RetryPurchaseDTO } from './dtos/retry-purchase.dto';
import { RetryPurchasePaymentCommand } from './commands/retry-purchase-payment/retry-purchase-payment.command';
import { FindPurchaseByIdQuery } from './queries/find-by-id/find-purchase-by-id.query';

describe('PurchasesController', () => {
  
  let controller: PurchasesController;
  let commandBus: CommandBusMock;
  let queryBus: QueryBusMock;

  const company: Company = {id: 'anyCompanyId'} as any;
  const user: User = {email: "any@email.com", id: "anyUserId"} as any;

  const purchaseDto = {
    products: [{
      productId: "anyProductId",
      stockOptionId: "anyStockId",
      amount: 10
    }],
    payment: {
      type: "MONEY"
    }
  } as any;

  beforeEach(async () => {
    commandBus = new CommandBusMock();
    queryBus = new QueryBusMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchasesController],
      imports: [
        CqrsModule,
        AuthenticationModule
      ]
    })
    .overrideProvider(CommandBus).useValue(commandBus)
    .overrideProvider(QueryBus).useValue(queryBus)
    .compile();

    controller = module.get<PurchasesController>(PurchasesController);
  });

  it('given find all purchases, then execute find purchases by user and company query', async () => {
    await controller.findByUserAndCompany(company, user);

    expect(queryBus.executedWith).toEqual(
      new FindPurchasesByUserAndCompanyQuery(
        "anyCompanyId",
        "anyUserId"
      )
    )
  })

  it('given find purchase by id, then execute find purchase by id query', async () => {
    await controller.findByUserId(company, user, "anyPurchaseId");

    expect(queryBus.executedWith).toEqual(
      new FindPurchaseByIdQuery(
        "anyCompanyId",
        "anyUserId",
        "anyPurchaseId"
      )
    )
  })

  it('given create purchase, then execute create purchase command', async () => {
    await controller.create(
      company, user, JSON.parse(JSON.stringify(purchaseDto)), "anyFile"
    );

    expect(commandBus.executed).toEqual(
      new CreatePurchaseCommand(
        "anyCompanyId",
        {
          ...purchaseDto,
          payment: {
            ...purchaseDto.payment,
            receipt: "anyFile",
          }
        },
        { email: "any@email.com", id: "anyUserId" }
      )
    )
  })

  describe('given retry purchase payment', () => {

    const retryPurchaseDTO: RetryPurchaseDTO = {
      payment: {
        type: "anyType"
      }
    }

    beforeEach(async () => {
      await controller.retryPayment(
        company, user, "anyPurchaseId", retryPurchaseDTO, "anyFile"
      );
    })

    it('then send receipt to retry purchase command', async () => {
      expect(retryPurchaseDTO.payment.receipt).toEqual("anyFile");
    })

    it('then execute retry purchase payment command', async () => {
      expect(commandBus.executed).toEqual(
        new RetryPurchasePaymentCommand(
          "anyCompanyId",
          "anyPurchaseId",
          retryPurchaseDTO,
          { email: "any@email.com", id: "anyUserId" }
        )
      )
    })

  })

});
