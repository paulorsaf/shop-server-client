export class MakePaymentBySavedCreditCardCommand {
    constructor(
        public readonly companyId: string,
        public readonly purchaseId: string,
        public readonly creditCardId: string
    ){}
}