import { Module } from '@nestjs/common';
import { DeliveriesController } from './deliveries.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { FindDeliveryPriceByZipCodeQueryHandler } from './queries/find-delivery-price-by-zipcode/find-delivery-price-by-zipcode-query.handler';
import { AddressRepository } from '../../repositories/address.repository';
import { DeliveryRepository } from '../../repositories/delivery.repository';
import { DeliveryService } from '../../services/delivery.service';

@Module({
  controllers: [DeliveriesController],
  imports: [
    CqrsModule,
    AuthenticationModule
  ],
  providers: [
    AddressRepository,
    DeliveryRepository,
    DeliveryService,

    FindDeliveryPriceByZipCodeQueryHandler
  ]
})
export class DeliveriesModule {}
