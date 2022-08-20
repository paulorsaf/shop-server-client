import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
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
import { FindPurchasesByUserAndCompanyQuery } from './queries/find-all/find-purchases-by-user-and-company.query';
import { Base64UploadToFileName } from '../../file-upload/decorators/base64-upload-to-file-name.decorator';
import { Base64FileUploadToFileStrategy } from '../../file-upload/strategies/base64-upload-to-file-name.strategy';

@Controller('purchases')
export class PurchasesController {

  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus
  ) {}

  @UseGuards(CompanyStrategy, JwtStrategy)
  @Get()
  findByUserAndCompany(@AuthCompany() company: Company, @AuthUser() user: User) {
    const purchase = new Purchase({
      companyId: company.id,
      userId: user.id
    });

    return this.queryBus.execute(
      new FindPurchasesByUserAndCompanyQuery(purchase)
    )
  }

  @UseGuards(CompanyStrategy, JwtStrategy, Base64FileUploadToFileStrategy)
  @Post()
  create(
    @AuthCompany() company: Company,
    @AuthUser() user: User,
    @Body() purchaseDto: PurchaseDTO,
    @Base64UploadToFileName() fileName: string
  ) {
    const purchase = this.createPurchase(company, user, purchaseDto);

    return this.commandBus.execute(
      new CreatePurchaseCommand(company, purchase, {
        type: purchaseDto.payment.type,
        receipt: fileName
      }, user)
    )
  }

  private createPurchase(company: Company, user: User, purchaseDto: PurchaseDTO) {
    return new Purchase({
      address: purchaseDto.deliveryAddress,
      companyId: company.id,
      payment: {
        type: purchaseDto.payment.type
      },
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
