export class SendPaymentSuccessEmailToClientCommand {
    constructor(
        public readonly companyId: string,
        public readonly purchaseId: string
    ){}
}