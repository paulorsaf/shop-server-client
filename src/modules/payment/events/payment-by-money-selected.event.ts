export class PaymentByMoneySelectedEvent {
    private readonly eventType = "PAYMENT_BY_MONEY_SELECTED_EVENT";
    constructor(
        public readonly companyId: string,
        public readonly purchaseId: string,
        public readonly changeFor: number
    ){}
}