export class FindCupomQuery {
    constructor(
        public readonly companyId: string,
        public readonly cupom: string
    ) {}
}