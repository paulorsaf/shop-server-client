export class SavePaymentByMoneyCommand {
    constructor(
        public readonly companyId: string,
        public readonly purchaseId: string,
        public readonly changeFor: number
    ){}
}