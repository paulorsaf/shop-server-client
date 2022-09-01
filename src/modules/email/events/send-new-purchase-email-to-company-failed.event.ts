export class SendNewPurchaseEmailToCompanyFailedEvent {
    private readonly eventType = "SEND_NEW_PURCHASE_EMAIL_TO_COMPANY_FAILED_EVENT";
    constructor(
        public readonly companyId: string,
        public readonly purchaseId: string,
        public readonly error: any
    ){}

}