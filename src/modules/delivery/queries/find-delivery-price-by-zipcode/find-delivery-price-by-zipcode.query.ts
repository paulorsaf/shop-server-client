import { CompanyDTO } from "../../dtos/company.dto";
import { ProductDTO } from "../../dtos/product.dto";

export class FindDeliveryPriceByZipCodeQuery {
    constructor(
        public readonly company: CompanyDTO,
        public readonly zipCode: string,
        public readonly products: ProductDTO[] = []
    ){}
}