export class AddPurchaseSummaryCommand {
    constructor(
        public readonly companyId: string,
        public readonly purchaseId: string
    ){}
}