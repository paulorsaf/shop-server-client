export class PaymentByMoneySavedEvent {
    private readonly eventType = "PAYMENT_BY_MONEY_SAVED_EVENT";
    constructor(
        public readonly companyId: string,
        public readonly purchaseId: string,
        public readonly changeFor: number,
        public readonly userId: string
    ){}
}