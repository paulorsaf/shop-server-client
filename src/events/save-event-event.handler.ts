import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { ProductsPurchasedDecreasedStockEvent } from "../modules/stocks/commands/decrease-amount-on-stock-options/events/products-purchases-decreased-stock.event";
import { PurchaseCreatedEvent } from "../modules/purchases/commands/create-purchase/events/purchase-created.event";
import { UserRegisteredInCompanyEvent } from "../modules/register/commands/events/user-registered-in-company.event";
import { UserRegisteredEvent } from "../modules/register/commands/events/user-registered.event";
import { EventRepository } from "../repositories/event.repository";
import { ProductsPurchasedTotalStockUpdatedEvent } from "../modules/stocks/commands/update-product-stock-list/events/products-purchased-total-stock-updated.event";
import { PaymentByPixSavedEvent } from "../modules/payment/events/payment-by-pix-saved.event";
import { PaymentFailedEvent } from "../modules/payment/events/payment-failed.event";
import { PurchasePaymentRetriedEvent } from "../modules/purchases/events/purchase-payment-retried.event";
import { NewPurchaseEmailSentToCompanyEvent } from "../modules/email/events/new-purchase-email-sent-to-company.event";
import { SendNewPurchaseEmailToCompanyFailedEvent } from "../modules/email/events/send-new-purchase-email-to-company-failed.event";
import { NewPurchaseEmailSentToClientEvent } from "../modules/email/events/new-purchase-email-sent-to-client.event";
import { SendNewPurchaseEmailToClientFailedEvent } from "../modules/email/events/send-new-purchase-email-to-client-failed.event";
import { PurchaseGeolocationSavedEvent } from "../modules/address/events/puchase-geolocation-saved.event";
import { PaymentByCreditCardCreatedEvent } from "../modules/payment/events/payment-by-credit-card-created.event";
import { PaymentSuccessEmailSentToClientEvent } from "../modules/email/events/payment-success-email-sent-to-client.event";
import { SendPaymentSuccessEmailToClientFailedEvent } from "../modules/email/events/send-payment-success-email-to-client-failed.event";

@EventsHandler(
    PurchaseCreatedEvent,
    ProductsPurchasedDecreasedStockEvent,
    ProductsPurchasedTotalStockUpdatedEvent,
    PaymentByPixSavedEvent,
    PaymentByCreditCardCreatedEvent,
    PaymentFailedEvent,
    PurchaseGeolocationSavedEvent,
    PurchasePaymentRetriedEvent,

    NewPurchaseEmailSentToCompanyEvent,
    SendNewPurchaseEmailToCompanyFailedEvent,
    NewPurchaseEmailSentToClientEvent,
    SendNewPurchaseEmailToClientFailedEvent,
    PaymentSuccessEmailSentToClientEvent,
    SendPaymentSuccessEmailToClientFailedEvent,

    UserRegisteredEvent,
    UserRegisteredInCompanyEvent
)
export class SaveEventHandler implements IEventHandler<any> {

    constructor(
        private eventRepository: EventRepository
    ){}

    handle(event: any) {
        this.eventRepository.addEvent(event);
    }

}