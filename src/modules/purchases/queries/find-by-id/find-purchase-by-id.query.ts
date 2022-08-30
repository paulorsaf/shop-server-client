export class FindPurchaseByIdQuery {
    constructor(
        public readonly companyId: string,
        public readonly userId: string,
        public readonly purchaseId: string
    ){}
}