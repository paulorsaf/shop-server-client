export class SendNewPurchaseEmailToClientCommand {
    constructor(
        public readonly companyId: string,
        public readonly purchaseId: string
    ){}
}