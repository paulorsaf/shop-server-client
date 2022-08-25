import { RetryPaymentDTO } from "../dtos/retry-purchase.dto";

export class PurchasePaymentRetriedEvent {
    private readonly eventType = "PURCHASE_PAYMENT_RETRIED_EVENT";
    constructor(
        public readonly companyId: string,
        public readonly purchaseId: string,
        public readonly payment: RetryPaymentDTO
    ){}
}