import { AddressDTO, CreditCardDTO } from "../dtos/payment.dto";

export class PaymentByCreditCardSelectedEvent {
    private readonly eventType = "PAYMENT_BY_CREDIT_CARD_SELECTED_EVENT";
    constructor(
        public readonly companyId: string,
        public readonly purchaseId: string,
        public readonly billingAddress: AddressDTO,
        public readonly creditCard: CreditCardDTO
    ){}
}