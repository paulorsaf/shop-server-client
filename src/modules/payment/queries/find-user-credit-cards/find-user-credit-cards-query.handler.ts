import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PaymentFactory } from "../../factories/payment.factory";
import { FindUserCreditCardsQuery } from "./find-user-credit-cards.query";

@QueryHandler(FindUserCreditCardsQuery)
export class FindUserCreditCardsQueryHandler implements IQueryHandler<FindUserCreditCardsQuery> {

    constructor(
        private paymentFactory: PaymentFactory
    ){}

    async execute(query: FindUserCreditCardsQuery) {
        const payment = this.paymentFactory.createPayment(query.companyId);

        return await payment.findCreditCards({
            email: query.email, userId: query.userId
        })
    }

}