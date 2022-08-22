import { Injectable } from "@nestjs/common";
import { ICommand, ofType, Saga } from "@nestjs/cqrs";
import { map, Observable } from "rxjs";
import { SavePaymentByPixCommand } from "../commands/save-payment-by-pix/save-payment-by-pix.command";
import { SavePaymentErrorCommand } from "../commands/save-payment-error/save-payment-error.command";
import { PaymentByPixSelectedEvent } from "../events/payment-by-pix-selected.event";
import { PaymentFailedEvent } from "../events/payment-failed.event";

@Injectable()
export class PaymentSagas {

    @Saga()
    paymentByPixSelected = (events$: Observable<any>): Observable<ICommand> => 
        events$.pipe(
            ofType(PaymentByPixSelectedEvent),
            map(event =>
                new SavePaymentByPixCommand(
                    event.companyId,
                    event.purchaseId,
                    event.receipt
                )
            )
        );

    @Saga()
    paymentFailed = (events$: Observable<any>): Observable<ICommand> => 
        events$.pipe(
            ofType(PaymentFailedEvent),
            map(event =>
                new SavePaymentErrorCommand(
                    event.companyId,
                    event.purchaseId,
                    event.error
                )
            )
        );

}