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
import { RetryPurchaseDTO } from './dtos/retry-purchase.dto';
import { RetryPurchasePaymentCommand } from './commands/retry-purchase-payment/retry-purchase-payment.command';
import { FindPurchaseByIdQuery } from './queries/find-by-id/find-purchase-by-id.query';
import { CalculatePurchasePriceQuery } from './queries/calculate-purchase-price/calculate-purchase-price.query';
import { FindLastPurchaseByCompanyAndUserIdQuery } from './queries/find-last-purchase-by-company-and-user-id/find-last-purchase-by-company-and-user-id.query';

describe('PurchasesController', () => {
  
  let controller: PurchasesController;
  let commandBus: CommandBusMock;
  let queryBus: QueryBusMock;

  const company: Company = {
    id: 'anyCompanyId',
    address: {city: "anyCity", zipCode: "anyZipCode"},
    cityDeliveryPrice: 10,
    payment: {id: "anyPayment"},
    serviceTax: 10
  } as any;
  const user: User = {email: "any@email.com", id: "anyUserId"} as any;

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

  it('given find last purchase, then execute find last purchase by user and company query', async () => {
    await controller.findLastPurchaseByUserAndCompany(company, user);

    expect(queryBus.executedWith).toEqual(
      new FindLastPurchaseByCompanyAndUserIdQuery(
        "anyCompanyId",
        "anyUserId"
      )
    )
  })

  it('given find purchase by id, then execute find purchase by id query', async () => {
    await controller.findById(company, user, "anyPurchaseId");

    expect(queryBus.executedWith).toEqual(
      new FindPurchaseByIdQuery(
        "anyCompanyId",
        "anyUserId",
        "anyPurchaseId"
      )
    )
  })

  it('given calculate price, then execute calculate purchase price query', async () => {
    const dto = {
      address: {destinationZipCode: "anyDestination"},
      cityDeliveryPrice: 10,
      cupom: "anyCupom",
      paymentType: "anyPaymentType",
      products: [{id: "anyProduct"}]
    } as any;

    await controller.calculatePrice(company, dto);

    expect(queryBus.executedWith).toEqual(
      new CalculatePurchasePriceQuery({
        ...dto,
        address: {
          ...dto.address,
          originZipCode: "anyZipCode"
        },
        company: {
          city: "anyCity",
          id: "anyCompanyId",
          serviceTax: 10
        },
        cupom: "anyCupom",
        payment: company.payment
      })
    )
  })

  describe('given create purchase', () => {

    it('then execute create purchase command', async () => {
      const purchaseDto = {
        id: "anyPurchaseDTO",
        payment: {}
      } as any;
  
      await controller.createWithFile(company, user, purchaseDto, "anyFile");
  
      expect(commandBus.executed).toEqual(
        new CreatePurchaseCommand(
          {
            cityDeliveryPrice: 10,
            companyCity: "anyCity",
            id: "anyCompanyId",
            payment: {id: "anyPayment"} as any,
            zipCode: "anyZipCode",
            serviceTax: 10
          },
          purchaseDto,
          { email: "any@email.com", id: "anyUserId" }
        )
      )
    })

    it('then send receipt to create purchase command', async () => {
      const purchaseDto = {
        id: "anyPurchaseDTO",
        payment: {}
      } as any;
  
      await controller.createWithFile(company, user, purchaseDto, "anyFile");
  
      expect(purchaseDto.payment.receipt).toEqual("anyFile");
    })

  })

  describe('given retry purchase payment', () => {

    const retryPurchaseDTO: RetryPurchaseDTO = {
      payment: {
        type: "anyType"
      }
    }

    beforeEach(async () => {
      await controller.retryPaymentWithUpload(
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
