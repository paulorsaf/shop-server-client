export class PaymentBySavedCreditCardSelectedEvent {
    private readonly eventType = "PAYMENT_BY_SAVED_CREDIT_CARD_SELECTED_EVENT";
    constructor(
        public readonly companyId: string,
        public readonly purchaseId: string,
        public readonly creditCardId: string
    ){}
}