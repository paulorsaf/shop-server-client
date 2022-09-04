import { CompanyDTO } from "../../dtos/company.dto";

export class FindDeliveryPriceByZipCodeQuery {
    constructor(
        public readonly company: CompanyDTO,
        public readonly zipCode: string
    ){}
}