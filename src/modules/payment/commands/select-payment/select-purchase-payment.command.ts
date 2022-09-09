import { PaymentDTO } from "../../dtos/payment.dto";

export class SelectPurchasePaymentCommand {
    constructor(
        public readonly companyId: string,
        public readonly purchaseId: string,
        public readonly payment: PaymentDTO
    ){}
}