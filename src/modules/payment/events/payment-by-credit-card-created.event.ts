import { PayByCreditCardResponse } from "../repositories/payment-gateway/payment-gateway.interface";

export class PaymentByCreditCardCreatedEvent {
    private readonly eventType = "PAYMENT_BY_CREDIT_CARD_CREATED_EVENT";
    constructor(
        public readonly companyId: string,
        public readonly purchaseId: string,
        public readonly payment: PayByCreditCardResponse
    ){}
}