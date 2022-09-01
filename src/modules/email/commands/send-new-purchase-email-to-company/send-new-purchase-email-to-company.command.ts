export class SendNewPurchaseEmailToCompanyCommand {
    constructor(
        public readonly companyId: string,
        public readonly purchaseId: string
    ){}
}