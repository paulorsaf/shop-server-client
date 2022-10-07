import { NotFoundException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { CreditCardDeletedEvent } from "../../events/credit-card-deleted.event";
import { PaymentFactory } from "../../factories/payment.factory";
import { DeleteCreditCardByIdCommand } from "./delete-credit-card-by-id.command";

@CommandHandler(DeleteCreditCardByIdCommand)
export class DeleteCreditCardByIdCommandHandler implements ICommandHandler<DeleteCreditCardByIdCommand> {

    constructor(
        private eventBus: EventBus,
        private paymentFactory: PaymentFactory
    ){}

    async execute(command: DeleteCreditCardByIdCommand) {
        const paymentService = this.paymentFactory.createPayment(command.companyId);

        const creditCard = await paymentService.findCreditCardById({
            id: command.creditCardId, userId: command.user.id
        });
        if (!creditCard) {
            throw new NotFoundException();
        }
        
        await paymentService.deleteCreditCard(creditCard.id);

        this.publishCreditCardDeletedEvent(command, creditCard.id);
    }

    private publishCreditCardDeletedEvent(
        command: DeleteCreditCardByIdCommand, id: string
    ) {
        this.eventBus.publish(
            new CreditCardDeletedEvent(
                command.companyId,
                id,
                command.user.id
            )
        );
    }

}