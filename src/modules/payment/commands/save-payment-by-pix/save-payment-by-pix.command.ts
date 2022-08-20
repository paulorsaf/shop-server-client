import { PurchasePaymentByPix } from "../../model/purchase/purchase-payment-by-pix.model";

export class SavePaymentByPixCommand {
    constructor(
        public readonly purchasePayment: PurchasePaymentByPix
    ){}
}