export class SetPurchaseSummaryGeolocationCommand {
    constructor(
        public readonly companyId: string,
        public readonly purchaseId: string
    ){}
}