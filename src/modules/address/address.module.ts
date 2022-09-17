import { Module } from '@nestjs/common';
import { AddressController } from './address.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { FindAddressByZipcodeQueryHandler } from './queries/find-address-by-zipcode/find-address-by-zipcode-query.handler';
import { AddressRepository } from './repositories/address.repository';
import { SavePurchaseGeolocationCommandHandler } from './commands/save-purchase-geolocation/save-purchase-geolocation-command.handler';
import { PurchaseRepository } from './repositories/purchase.repository';
import { AddressSagas } from './sagas/address.saga';

@Module({
  controllers: [AddressController],
  imports: [
    CqrsModule,
    AuthenticationModule
  ],
  providers: [
    AddressRepository,
    PurchaseRepository,

    FindAddressByZipcodeQueryHandler,
    SavePurchaseGeolocationCommandHandler,

    AddressSagas
  ]
})
export class AddressModule {}
