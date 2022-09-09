import { Injectable } from "@nestjs/common";
import { ICommand, ofType, Saga } from "@nestjs/cqrs";
import { map, Observable } from "rxjs";
import { SendPaymentSuccessEmailToClientCommand } from "../../email/commands/send-payment-success-email-to-client/send-payment-success-email-to-client.command";
import { MakePaymentByCreditCardCommand } from "../commands/make-payment-by-credit-card/make-payment-by-credit-card.command";
import { SavePaymentByPixCommand } from "../commands/save-payment-by-pix/save-payment-by-pix.command";
import { SavePaymentErrorCommand } from "../commands/save-payment-error/save-payment-error.command";
import { PaymentByCreditCardCreatedEvent } from "../events/payment-by-credit-card-created.event";
import { PaymentByCreditCardSelectedEvent } from "../events/payment-by-credit-card-selected.event";
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
    paymentByCreditCardSelected = (events$: Observable<any>): Observable<ICommand> => 
        events$.pipe(
            ofType(PaymentByCreditCardSelectedEvent),
            map(event =>
                new MakePaymentByCreditCardCommand(
                    event.companyId,
                    event.purchaseId,
                    event.billingAddress,
                    event.creditCard
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

    @Saga()
    paymentByCreditCardCreated = (events$: Observable<any>): Observable<ICommand> => 
        events$.pipe(
            ofType(PaymentByCreditCardCreatedEvent),
            map(event => 
                new SendPaymentSuccessEmailToClientCommand(
                    event.companyId,
                    event.purchaseId
                )
            )
        );

}