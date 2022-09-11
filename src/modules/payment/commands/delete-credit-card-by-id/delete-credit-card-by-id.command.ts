export class DeleteCreditCardByIdCommand {
    constructor(
        public readonly companyId: string,
        public readonly creditCardId: string,
        public readonly user: User
    ){}
}

type User = {
    email: string;
    id: string;
}