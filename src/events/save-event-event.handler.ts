import { EventsHandler, IEventHandler } from "@nestjs/cqrs";
import { UserRegisteredInCompanyEvent } from "../modules/register/commands/events/user-registered-in-company.event";
import { UserRegisteredEvent } from "../modules/register/commands/events/user-registered.event";
import { EventRepository } from "../repositories/event.repository";

@EventsHandler(
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