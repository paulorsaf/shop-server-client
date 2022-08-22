export class PaymentByPixSelectedEvent {
    private readonly eventType = "PAYMENT_BY_PIX_SELECTED_EVENT";
    constructor(
        public readonly companyId: string,
        public readonly purchaseId: string,
        public readonly receipt: string
    ){}
}