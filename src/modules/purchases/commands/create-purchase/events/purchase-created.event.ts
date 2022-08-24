import { PaymentDTO } from '../../../dtos/purchase.dto';
import { CreatePurchase } from '../../../model/create-purchase.model';

export class PurchaseCreatedEvent {
    private readonly eventType = "PURCHASE_CREATED_EVENT";
    constructor(
        public readonly companyId: string,
        public readonly purchaseId: string,
        public readonly purchase: CreatePurchase,
        public readonly payment: PaymentDTO,
        public readonly userId: string
    ){}
}