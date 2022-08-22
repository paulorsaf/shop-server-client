import { Injectable } from "@nestjs/common";
import { ICommand, ofType, Saga } from "@nestjs/cqrs";
import { map, Observable } from "rxjs";
import { SavePaymentByPixCommand } from "../commands/save-payment-by-pix/save-payment-by-pix.command";
import { SavePaymentErrorCommand } from "../commands/save-payment-error/save-payment-error.command";
import { PaymentByPixSelectedEvent } from "../events/payment-by-pix-selected.event";
import { PaymentFailedEvent } from "../events/payment-failed.event";
import { PaymentByPix } from "../model/payment/payment-by-pix.model";
import { PurchasePaymentByPix } from "../model/purchase/purchase-payment-by-pix.model";

@Injectable()
export class PaymentSagas {

    @Saga()
    paymentByPixSelected = (events$: Observable<any>): Observable<ICommand> => 
        events$.pipe(
            ofType(PaymentByPixSelectedEvent),
            map(event =>
                new SavePaymentByPixCommand(
                    new PurchasePaymentByPix({
                        companyId: event.purchase.companyId,
                        userId: event.purchase.userId,
                        purchaseId: event.purchase.id,
                        payment: new PaymentByPix({
                            receipt: event.purchase.payment.receipt
                        })
                    })
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
                    event.error,
                    event.userId
                )
            )
        );

}