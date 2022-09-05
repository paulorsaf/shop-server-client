import { UserType } from "../../../../authentication/model/user-type";

export class UserRegisteredEvent {
    private readonly eventType = "USER_CREATED_EVENT";
    constructor(
        public readonly userId: string,
        public readonly companyId: string,
        public readonly user: User
    ){}
}

type User = {
    cpfCnpj: string,
    email: string,
    name: string,
    phone: string,
    type: UserType
}