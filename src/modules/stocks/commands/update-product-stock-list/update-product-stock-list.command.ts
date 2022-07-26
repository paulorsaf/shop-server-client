import { Product } from "./model/product.model";

export class UpdateProductStockListCommand {

    constructor(
        public readonly companyId: string,
        public readonly purchaseId: string,
        public readonly products: Product[],
        public readonly updatedBy: string
    ){}

}