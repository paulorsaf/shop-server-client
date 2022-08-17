import { Injectable } from "@nestjs/common";
import { ICommand, ofType, Saga } from "@nestjs/cqrs";
import { map, Observable } from "rxjs";
import { Product } from "../../stocks/commands/decrease-amount-on-stock-options/model/product.model";
import { Stock } from "../../stocks/commands/decrease-amount-on-stock-options/model/stock.model";
import { DecreaseStockOptionsOnPurchaseCommand } from "../../stocks/commands/decrease-amount-on-stock-options/decrease-stock-options-on-purchase.command";
import { PurchaseCreatedEvent } from "../commands/create-purchase/events/purchase-created.event";

@Injectable()
export class PurchaseSagas {

    @Saga()
    purchaseCreated = (events$: Observable<any>): Observable<ICommand> => 
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

}