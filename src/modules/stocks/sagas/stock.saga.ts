import { Injectable } from "@nestjs/common";
import { ICommand, ofType, Saga } from "@nestjs/cqrs";
import { map, Observable } from "rxjs";
import { ProductsPurchasedDecreasedStockEvent } from "../commands/decrease-amount-on-stock-options/events/products-purchases-decreased-stock.event";
import { Product } from "../commands/update-product-stock-list/model/product.model";
import { UpdateProductStockListCommand } from "../commands/update-product-stock-list/update-product-stock-list.command";

@Injectable()
export class StockSagas {

    @Saga()
    productsPurchasesStockDecreased = (events$: Observable<any>): Observable<ICommand> => 
        events$.pipe(
            ofType(ProductsPurchasedDecreasedStockEvent),
            map(event => 
                new UpdateProductStockListCommand(
                    event.companyId,
                    event.purchaseId,
                    event.products.map(p => 
                        new Product({productId: p.productId})
                    ),
                    event.userId
                )
            )
        );

}