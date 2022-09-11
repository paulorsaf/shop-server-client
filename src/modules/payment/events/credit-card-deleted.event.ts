export class CreditCardDeletedEvent {
    private readonly eventType = "CREDIT_CARD_DELETED_EVENT";
    constructor(
        public readonly companyId: string,
        public readonly creditCardId: string,
        public readonly userId: string
    ){}
}