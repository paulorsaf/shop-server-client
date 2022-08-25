import { Injectable } from "@nestjs/common";
import { ICommand, ofType, Saga } from "@nestjs/cqrs";
import { map, Observable } from "rxjs";
import { Product } from "../../stocks/commands/decrease-amount-on-stock-options/model/product.model";
import { Stock } from "../../stocks/commands/decrease-amount-on-stock-options/model/stock.model";
import { DecreaseStockOptionsOnPurchaseCommand } from "../../stocks/commands/decrease-amount-on-stock-options/decrease-stock-options-on-purchase.command";
import { PurchaseCreatedEvent } from "../commands/create-purchase/events/purchase-created.event";
import { PurchasePayment } from "../../payment/model/purchase/puchase-payment.model";
import { Payment } from "../../payment/model/payment/payment.model";
import { SelectPurchasePaymentCommand } from "../../payment/commands/select-payment/select-purchase-payment.command";
import { PurchasePaymentRetriedEvent } from "../events/purchase-payment-retried.event";

@Injectable()
export class PurchaseSagas {

    @Saga()
    purchaseCreatedDecreaseStock = (events$: Observable<any>): Observable<ICommand> => 
        events$.pipe(
            ofType(PurchaseCreatedEvent),
            map(event =>
                new DecreaseStockOptionsOnPurchaseCommand(
                    event.companyId,
                    event.purchaseId,
                    event.purchase.products.map(p => ({
                        amount: p.amount,
                        productId: p.id,
                        stock: {
                            id: p.stock.id,
                            quantity: p.stock.quantity
                        }
                    })),
                    event.userId
                )
            )
        );

    @Saga()
    purchaseCreatedMakePayment = (events$: Observable<any>): Observable<ICommand> => 
        events$.pipe(
            ofType(PurchaseCreatedEvent),
            map(event =>
                new SelectPurchasePaymentCommand(
                    event.companyId,
                    event.purchaseId,
                    event.payment.receipt
                )    
            )
        );

    @Saga()
    purchasePaymentRetriedMakePayment = (events$: Observable<any>): Observable<ICommand> => 
        events$.pipe(
            ofType(PurchasePaymentRetriedEvent),
            map(event =>
                new SelectPurchasePaymentCommand(
                    event.companyId,
                    event.purchaseId,
                    event.payment.receipt
                )    
            )
        );

}