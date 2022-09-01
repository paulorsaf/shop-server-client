export class NewPurchaseEmailSentToClientEvent {
    private readonly eventType = "NEW_PURCHASE_EMAIL_SENT_TO_CLIENT_EVENT";
    constructor(
        public readonly companyId: string,
        public readonly purchaseId: string
    ){}

}