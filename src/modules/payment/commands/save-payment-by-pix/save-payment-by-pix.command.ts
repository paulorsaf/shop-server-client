export class SavePaymentByPixCommand {
    constructor(
        public readonly companyId: string,
        public readonly purchaseId: string,
        public readonly receipt: string
    ){}
}