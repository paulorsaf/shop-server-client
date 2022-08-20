import { PurchasePayment } from "../../model/purchase/puchase-payment.model";

export class SelectPurchasePaymentCommand {
    constructor(
        public readonly purchase: PurchasePayment
    ){}
}