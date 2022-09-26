import { Module } from '@nestjs/common';
import { CupomsController } from './cupoms.controller';
import { AuthenticationModule } from '../../authentication/authentication.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CupomRepository } from './repositories/cupom.repository';
import { FindCupomQueryHandler } from './queries/find-cupom/find-cupom.query.handler';
import { DecreaseAmountOfCupomsCommandHandler } from './commands/decrease-amount-of-cupoms/decrease-amount-of-cupoms.command.handler';

@Module({
  controllers: [
    CupomsController
  ],
  imports: [
    CqrsModule,
    AuthenticationModule
  ],
  providers: [
    CupomRepository,

    FindCupomQueryHandler,

    DecreaseAmountOfCupomsCommandHandler
  ]
})
export class CupomsModule {}
