import { Test, TestingModule } from '@nestjs/testing';
import { PurchasesController } from './purchases.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { CommandBus } from '@nestjs/cqrs';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { Company } from '../../authentication/model/company';
import { CommandBusMock } from '../../mocks/command-bus.mock';
import { User } from '../../authentication/model/user';
import { CreatePurchaseCommand } from './commands/create-purchase/create-purchase.command';
import { Purchase } from './model/purchase.model';
import { Product } from './model/product.model';
import { Stock } from './model/stock.model';

describe('PurchasesController', () => {
  
  let controller: PurchasesController;
  let commandBus: CommandBusMock;

  const company: Company = {id: 'anyCompanyId'} as any;
  const user: User = {id: "anyUserId"} as any;

  beforeEach(async () => {
    commandBus = new CommandBusMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PurchasesController],
      imports: [
        CqrsModule,
        AuthenticationModule
      ]
    })
    .overrideProvider(CommandBus).useValue(commandBus)
    .compile();

    controller = module.get<PurchasesController>(PurchasesController);
  });

  it('given create purchase, then execute create purchase command', async () => {
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

    await controller.create(company, user, purchaseDto);

    expect(commandBus.executed).toEqual(
      new CreatePurchaseCommand(
        company,
        new Purchase({
          companyId: "anyCompanyId", userId: "anyUserId", 
          products: [new Product(
            "anyCompanyId", "anyProductId", 10, new Stock({
              id: "anyStockId", productId: "anyProductId"
            })
          )],
          payment: purchaseDto.payment
        }),
        user
      )
    )
  })

});
