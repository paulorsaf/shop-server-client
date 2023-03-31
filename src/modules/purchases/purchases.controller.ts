import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { AuthCompany } from '../../authentication/decorators/company.decorator';
import { Company } from '../../authentication/model/company';
import { CompanyStrategy } from '../../authentication/guards/company.strategy';
import { PurchaseDTO } from './dtos/purchase.dto';
import { AuthUser } from '../../authentication/decorators/user.decorator';
import { JwtStrategy } from '../../authentication/guards/jwt.strategy';
import { User } from '../../authentication/model/user';
import { CreatePurchaseCommand } from './commands/create-purchase/create-purchase.command';
import { FindPurchasesByUserAndCompanyQuery } from './queries/find-all/find-purchases-by-user-and-company.query';
import { RetryPurchaseDTO } from './dtos/retry-purchase.dto';
import { RetryPurchasePaymentCommand } from './commands/retry-purchase-payment/retry-purchase-payment.command';
import { FindPurchaseByIdQuery } from './queries/find-by-id/find-purchase-by-id.query';
import { CalculatePriceDTO } from './dtos/calculate-price.dto';
import { CalculatePurchasePriceQuery } from './queries/calculate-purchase-price/calculate-purchase-price.query';
import { FindLastPurchaseByCompanyAndUserIdQuery } from './queries/find-last-purchase-by-company-and-user-id/find-last-purchase-by-company-and-user-id.query';
import { MultipartUploadToFilePathStrategy } from '../../file-upload/strategies/multipart-upload-to-file-path.strategy';
import { MultipartUploadToFilePath } from '../../file-upload/decorators/multipart-upload-to-file-path.decorator';
import { MultipartUploadToObjectStrategy } from '../../file-upload/strategies/multipart-upload-to-object.strategy';
import { MultipartUploadToObject } from '../../file-upload/decorators/multipart-upload-to-object.decorator';

@Controller('purchases')
export class PurchasesController {

  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus
  ) {}

  @UseGuards(CompanyStrategy, JwtStrategy)
  @Get()
  findByUserAndCompany(@AuthCompany() company: Company, @AuthUser() user: User) {
    return this.queryBus.execute(
      new FindPurchasesByUserAndCompanyQuery(
        company.id,
        user.id
      )
    )
  }

  @UseGuards(CompanyStrategy, JwtStrategy)
  @Get('/last')
  findLastPurchaseByUserAndCompany(@AuthCompany() company: Company, @AuthUser() user: User) {
    return this.queryBus.execute(
      new FindLastPurchaseByCompanyAndUserIdQuery(
        company.id,
        user.id
      )
    )
  }

  @UseGuards(CompanyStrategy, JwtStrategy)
  @Get(':id')
  findById(
    @AuthCompany() company: Company,
    @AuthUser() user: User,
    @Param('id') purchaseId: string
  ) {
    return this.queryBus.execute(
      new FindPurchaseByIdQuery(
        company.id,
        user.id,
        purchaseId
      )
    )
  }

  @UseGuards(CompanyStrategy, JwtStrategy)
  @Patch('prices')
  calculatePrice(
    @AuthCompany() company: Company,
    @Body() priceDto: CalculatePriceDTO
  ) {
    return this.queryBus.execute(
      new CalculatePurchasePriceQuery({
        address: {
          destinationZipCode: priceDto.address?.destinationZipCode,
          originZipCode: company.address.zipCode
        },
        cityDeliveryPrice: company.cityDeliveryPrice,
        company: {
          city: company.address.city,
          id: company.id,
          payment: company.payment,
          serviceTax: company.serviceTax
        },
        cupom: priceDto.cupom,
        payment: company.payment,
        paymentType: priceDto.paymentType,
        products: priceDto.products
      })
    )
  }

  @UseGuards(CompanyStrategy, JwtStrategy)
  @Post()
  create(
    @AuthCompany() company: Company,
    @AuthUser() user: User,
    @Body() purchaseDto: PurchaseDTO
  ) {
    return this.commandBus.execute(
      new CreatePurchaseCommand(
        {
          cityDeliveryPrice: company.cityDeliveryPrice,
          companyCity: company.address.city,
          id: company.id,
          payment: company.payment,
          zipCode: company.address.zipCode,
          serviceTax: company.serviceTax
        },
        purchaseDto,
        { email: user.email, id: user.id }
      )
    )
  }

  @UseGuards(
    CompanyStrategy,
    JwtStrategy,
    MultipartUploadToFilePathStrategy,
    MultipartUploadToObjectStrategy
  )
  @Post('pix')
  createWithFile(
    @AuthCompany() company: Company,
    @AuthUser() user: User,
    @MultipartUploadToObject() purchaseDto: PurchaseDTO,
    @MultipartUploadToFilePath() filePath: string
  ) {
    purchaseDto.payment.receipt = filePath;

    return this.commandBus.execute(
      new CreatePurchaseCommand(
        {
          cityDeliveryPrice: company.cityDeliveryPrice,
          companyCity: company.address.city,
          id: company.id,
          payment: company.payment,
          zipCode: company.address.zipCode,
          serviceTax: company.serviceTax
        },
        purchaseDto,
        { email: user.email, id: user.id }
      )
    )
  }

  @UseGuards(CompanyStrategy, JwtStrategy)
  @Patch(':id/payments')
  retryPayment(
    @AuthCompany() company: Company,
    @AuthUser() user: User,
    @Param('id') id: string,
    @Body() retryPurchaseDTO: RetryPurchaseDTO
  ) {
    return this.commandBus.execute(
      new RetryPurchasePaymentCommand(
        company.id,
        id,
        retryPurchaseDTO,
        { email: user.email, id: user.id }
      )
    )
  }

  @UseGuards(
    CompanyStrategy,
    JwtStrategy,
    MultipartUploadToFilePathStrategy,
    MultipartUploadToObjectStrategy
  )
  @Patch(':id/payments/pix')
  retryPaymentWithUpload(
    @AuthCompany() company: Company,
    @AuthUser() user: User,
    @Param('id') id: string,
    @MultipartUploadToObject() retryPurchaseDTO: RetryPurchaseDTO,
    @MultipartUploadToFilePath() filePath: string
  ) {
    retryPurchaseDTO.payment.receipt = filePath;

    return this.commandBus.execute(
      new RetryPurchasePaymentCommand(
        company.id,
        id,
        retryPurchaseDTO,
        { email: user.email, id: user.id }
      )
    )
  }

}
