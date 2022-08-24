import { ProductDTO } from "../../dtos/product.dto";

export class DecreaseStockOptionsOnPurchaseCommand {
    constructor(
        public readonly companyId: string,
        public readonly purchaseId: string,
        public readonly products: ProductDTO[],
        public readonly userId: string
    ){}
}