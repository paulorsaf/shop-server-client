import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { of } from 'rxjs';
import { AddressSagas } from './address.saga';
import { PurchaseGeolocationSavedEvent } from '../events/puchase-geolocation-saved.event';
import { SetPurchaseSummaryGeolocationCommand } from '../../purchase-summaries/commands/set-purchase-summary-geolocation/set-purchase-summary-geolocation.command';

describe('AddressSagas', () => {

  let sagas: AddressSagas;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        AddressSagas
      ],
      imports: [
        CqrsModule
      ]
    })
    .compile();

    sagas = module.get<AddressSagas>(AddressSagas);
  });

  it('given purchase payment retried, then execute select purchase payment command', done => {
    const event = new PurchaseGeolocationSavedEvent(
      "anyCompanyId",
      "anyPurchaseId",
      {latitude: 1, longitude: 2}
    );

    sagas.purchaseGeolocationSaved(of(event)).subscribe(response => {
      expect(response).toEqual(
        new SetPurchaseSummaryGeolocationCommand(
          "anyCompanyId",
          "anyPurchaseId"
        )
      );
      done();
    });
  });

});