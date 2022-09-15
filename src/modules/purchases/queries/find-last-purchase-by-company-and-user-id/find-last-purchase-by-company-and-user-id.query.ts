export class FindLastPurchaseByCompanyAndUserIdQuery {

    constructor(
        public readonly companyId: string,
        public readonly userId: string
    ){}

}