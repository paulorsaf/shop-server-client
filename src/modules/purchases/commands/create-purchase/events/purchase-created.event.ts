import { Purchase } from '../../../model/purchase.model';

export class PurchaseCreatedEvent {
    private readonly eventType = "PURCHASE_CREATED_EVENT";
    constructor(
        public readonly companyId: string,
        public readonly purchase: Purchase,
        public readonly userId: string
    ){}
}