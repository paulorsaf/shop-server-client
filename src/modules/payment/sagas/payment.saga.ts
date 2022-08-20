import { Injectable } from "@nestjs/common";
import { ICommand, ofType, Saga } from "@nestjs/cqrs";
import { map, Observable } from "rxjs";
import { SavePaymentByPixCommand } from "../commands/save-payment-by-pix/save-payment-by-pix.command";
import { PaymentByPixSelectedEvent } from "../events/payment-by-pix-selected.event";
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

}