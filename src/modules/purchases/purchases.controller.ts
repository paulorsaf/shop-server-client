import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AuthCompany } from '../../authentication/decorators/company.decorator';
import { Company } from '../../authentication/model/company';
import { CompanyStrategy } from '../../authentication/guards/company.strategy';
import { PurchaseDTO } from './dtos/purchase.dto';
import { AuthUser } from '../../authentication/decorators/user.decorator';
import { JwtStrategy } from '../../authentication/guards/jwt.strategy';
import { User } from '../../authentication/model/user';
import { CreatePurchaseCommand } from './commands/create-purchase/create-purchase.command';
import { Purchase } from './model/purchase.model';
import { Product } from './model/product.model';
import { Stock } from './model/stock.model';

@Controller('purchases')
export class PurchasesController {

  constructor(
    private commandBus: CommandBus
  ) {}

  @UseGuards(CompanyStrategy, JwtStrategy)
  @Post()
  create(
    @AuthCompany() company: Company,
    @AuthUser() user: User,
    @Body() purchaseDto: PurchaseDTO
  ) {
    const purchase = this.createPurchase(company, user, purchaseDto);

    return this.commandBus.execute(
      new CreatePurchaseCommand(company, purchase, user)
    )
  }

  private createPurchase(company: Company, user: User, purchaseDto: PurchaseDTO) {
    return new Purchase({
      address: purchaseDto.deliveryAddress,
      companyId: company.id,
      payment: purchaseDto.payment,
      products: purchaseDto.products.map(p => {
        return new Product(
          company.id, p.productId, p.amount, new Stock({
            id: p.stockOptionId, productId: p.productId
          })
        )
      }),
      userId: user.id
    });
  }

}
