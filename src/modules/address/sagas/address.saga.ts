import { Injectable } from "@nestjs/common";
import { ICommand, ofType, Saga } from "@nestjs/cqrs";
import { map, Observable } from "rxjs";
import { SetPurchaseSummaryGeolocationCommand } from "../../purchase-summaries/commands/set-purchase-summary-geolocation/set-purchase-summary-geolocation.command";
import { PurchaseGeolocationSavedEvent } from "../events/puchase-geolocation-saved.event";

@Injectable()
export class AddressSagas {

    @Saga()
    purchaseGeolocationSaved = (events$: Observable<any>): Observable<ICommand> => 
        events$.pipe(
            ofType(PurchaseGeolocationSavedEvent),
            map(event =>
                new SetPurchaseSummaryGeolocationCommand(
                    event.companyId,
                    event.purchaseId
                )
            )
        );

}