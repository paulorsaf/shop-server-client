export class PaymentSuccessEmailSentToClientEvent {
    private readonly eventType = "PAYMENT_SUCCESS_EMAIL_SENT_TO_CLIENT_EVENT";
    constructor(
        public readonly companyId: string,
        public readonly purchaseId: string
    ){}

}