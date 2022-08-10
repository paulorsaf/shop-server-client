export class RegisterUserCommand {
    constructor(
        public readonly companyId: string,
        public readonly cpfCnpj: string,
        public readonly email: string,
        public readonly name: string,
        public readonly password: string,
        public readonly phone: string
    ){}
}