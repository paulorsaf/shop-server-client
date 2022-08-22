export class SavePaymentErrorCommand {
    constructor(
        public readonly companyId: string,
        public readonly purchaseId: string,
        public readonly error: any
    ){}
}