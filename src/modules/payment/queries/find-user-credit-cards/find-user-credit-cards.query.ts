export class FindUserCreditCardsQuery {

    constructor(
        public readonly companyId: string,
        public readonly email: string,
        public readonly userId: string
    ){}

}