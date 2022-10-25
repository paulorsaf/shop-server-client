import { Injectable } from "@nestjs/common";
import { ICommand, ofType, Saga } from "@nestjs/cqrs";
import { map, Observable } from "rxjs";
import { DecreaseStockOptionsOnPurchaseCommand } from "../../stocks/commands/decrease-amount-on-stock-options/decrease-stock-options-on-purchase.command";
import { PurchaseCreatedEvent } from "../commands/create-purchase/events/purchase-created.event";
import { SelectPurchasePaymentCommand } from "../../payment/commands/select-payment/select-purchase-payment.command";
import { PurchasePaymentRetriedEvent } from "../events/purchase-payment-retried.event";
import { SendNewPurchaseEmailToCompanyCommand } from "../../email/commands/send-new-purchase-email-to-company/send-new-purchase-email-to-company.command";
import { SendNewPurchaseEmailToClientCommand } from "../../email/commands/send-new-purchase-email-to-client/send-new-purchase-email-to-client.command";
import { SavePurchaseGeolocationCommand } from "../../address/commands/save-purchase-geolocation/save-purchase-geolocation.command";
import { AddPurchaseSummaryCommand } from "../../purchase-summaries/commands/add-purchase-summary/add-purchase-summary.command";
import { DecreaseAmountOfCupomsCommand } from "../../cupoms/commands/decrease-amount-of-cupoms/decrease-amount-of-cupoms.command";

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
                        },
                        unit: p.unit,
                        weight: p.weight
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
                    event.payment
                )
            )
        );

    @Saga()
    purchaseCreatedSendEmailToCompany = (events$: Observable<any>): Observable<ICommand> => 
        events$.pipe(
            ofType(PurchaseCreatedEvent),
            map(event =>
                new SendNewPurchaseEmailToCompanyCommand(
                    event.companyId,
                    event.purchaseId
                )    
            )
        );

    @Saga()
    purchaseCreatedAddPurchaseSummary = (events$: Observable<any>): Observable<ICommand> => 
        events$.pipe(
            ofType(PurchaseCreatedEvent),
            map(event =>
                new AddPurchaseSummaryCommand(
                    event.companyId,
                    event.purchaseId
                )    
            )
        );

    @Saga()
    purchaseCreatedSendEmailToClient = (events$: Observable<any>): Observable<ICommand> => 
        events$.pipe(
            ofType(PurchaseCreatedEvent),
            map(event =>
                new SendNewPurchaseEmailToClientCommand(
                    event.companyId,
                    event.purchaseId
                )    
            )
        );

    @Saga()
    purchaseCreatedSavePurchaseGeolocation = (events$: Observable<any>): Observable<ICommand> => 
        events$.pipe(
            ofType(PurchaseCreatedEvent),
            map(event =>
                new SavePurchaseGeolocationCommand(
                    event.companyId,
                    event.purchaseId
                )
            )
        );

    @Saga()
    purchaseCreatedDecreaseAmountOfCupoms = (events$: Observable<any>): Observable<ICommand> => 
        events$.pipe(
            ofType(PurchaseCreatedEvent),
            map(event =>
                new DecreaseAmountOfCupomsCommand(
                    event.companyId,
                    event.payment.cupom,
                    event.userId
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
                    event.payment
                )    
            )
        );

}