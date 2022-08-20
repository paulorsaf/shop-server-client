import { PaymentDTO } from 'src/modules/purchases/dtos/purchase.dto';
import { Purchase } from '../../../model/purchase.model';

export class PurchaseCreatedEvent {
    private readonly eventType = "PURCHASE_CREATED_EVENT";
    constructor(
        public readonly companyId: string,
        public readonly purchaseId: string,
        public readonly purchase: Purchase,
        public readonly payment: PaymentDTO,
        public readonly userId: string
    ){}
}