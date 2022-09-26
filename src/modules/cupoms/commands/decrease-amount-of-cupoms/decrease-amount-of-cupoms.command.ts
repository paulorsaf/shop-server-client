export class DecreaseAmountOfCupomsCommand {
    constructor(
        public readonly companyId: string,
        public readonly cupom: string,
        public readonly userId: string
    ){}
}