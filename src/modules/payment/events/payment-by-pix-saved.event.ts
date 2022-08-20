export class PaymentByPixSavedEvent {
    private readonly eventType = "PAYMENT_BY_PIX_SAVED_EVENT";
    constructor(
        public readonly companyId: string,
        public readonly purchaseId: string,
        public readonly receiptUrl: string,
        public readonly userId: string
    ){}
}