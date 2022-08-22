export class PaymentFailedEvent {
    private readonly eventType = "PAYMENT_FAILED_EVENT";
    constructor(
        public readonly companyId: string,
        public readonly purchaseId: string,
        public readonly error: any
    ){}
}