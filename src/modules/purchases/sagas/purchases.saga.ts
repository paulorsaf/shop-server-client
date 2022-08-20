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

@Injectable()
export class PurchaseSagas {

    @Saga()
    purchaseCreatedDecreaseStock = (events$: Observable<any>): Observable<ICommand> => 
        events$.pipe(
            ofType(PurchaseCreatedEvent),
            map(event =>
                new DecreaseStockOptionsOnPurchaseCommand(
                    event.companyId,
                    event.purchase.getId(),
                    event.purchase.getProducts().map(p => new Product({
                        productId: p.getId(),
                        amount: p.getAmount(),
                        stock: new Stock({
                            id: p.getStock().getId(),
                            quantity: p.getStock().getQuantity()
                        })
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
                    new PurchasePayment({
                        companyId: event.companyId,
                        id: event.purchase.getId(),
                        payment: new Payment({
                            receipt: event.payment.receipt,
                            type: event.payment.type
                        }),
                        userId: event.userId
                    })
                )    
            )
        );

}