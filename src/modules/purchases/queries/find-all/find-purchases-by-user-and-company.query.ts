export class FindPurchasesByUserAndCompanyQuery {
    constructor(
        public readonly companyId: string,
        public readonly userId: string
    ){}
}