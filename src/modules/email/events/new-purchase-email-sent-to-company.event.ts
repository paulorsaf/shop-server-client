export class NewPurchaseEmailSentToCompanyEvent {
    private readonly eventType = "NEW_PURCHASE_EMAIL_SENT_TO_COMPANY_EVENT";
    constructor(
        public readonly companyId: string,
        public readonly purchaseId: string
    ){}

}