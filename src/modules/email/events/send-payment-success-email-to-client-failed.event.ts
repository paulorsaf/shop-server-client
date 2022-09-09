export class SendPaymentSuccessEmailToClientFailedEvent {
    private readonly eventType = "SEND_PAYMENT_SUCCESS_EMAIL_TO_CLIENT_FAILED_EVENT";
    constructor(
        public readonly companyId: string,
        public readonly purchaseId: string,
        public readonly error: any
    ){}

}