import { PurchasePayment } from "../model/purchase/puchase-payment.model";

export class PaymentByPixSelectedEvent {
    private readonly eventType = "PAYMENT_BY_PIX_SELECTED_EVENT";
    constructor(
        public readonly purchase: PurchasePayment
    ){}
}