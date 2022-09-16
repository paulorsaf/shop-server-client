export class SetPurchaseSummaryPaymentSuccessCommand {
    constructor(
        public readonly companyId: string,
        public readonly purchaseId: string
    ){}
}