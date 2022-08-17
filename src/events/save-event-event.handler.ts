import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { ProductsPurchasedDecreasedStockEvent } from "../modules/stocks/commands/decrease-amount-on-stock-options/events/products-purchases-decreased-stock.event";
import { PurchaseCreatedEvent } from "../modules/purchases/commands/create-purchase/events/purchase-created.event";
import { UserRegisteredInCompanyEvent } from "../modules/register/commands/events/user-registered-in-company.event";
import { UserRegisteredEvent } from "../modules/register/commands/events/user-registered.event";
import { EventRepository } from "../repositories/event.repository";
import { ProductsPurchasedTotalStockUpdatedEvent } from "../modules/stocks/commands/update-product-stock-list/events/products-purchased-total-stock-updated.event";

@EventsHandler(
    PurchaseCreatedEvent,
    ProductsPurchasedDecreasedStockEvent,
    ProductsPurchasedTotalStockUpdatedEvent,

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