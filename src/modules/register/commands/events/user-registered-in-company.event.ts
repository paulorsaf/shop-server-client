export class UserRegisteredInCompanyEvent {
    private readonly eventType = "USER_REGISTERED_IN_COMPANY_EVENT";
    constructor(
        public readonly userId: string,
        public readonly companyId: string
    ){}
}