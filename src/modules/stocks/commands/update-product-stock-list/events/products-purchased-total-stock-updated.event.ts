export class ProductsPurchasedTotalStockUpdatedEvent {
    private readonly eventType = "PRODUCTS_PURCHASED_TOTAL_STOCK_UPDATED_EVENT";

    constructor(
        private readonly companyId: string,
        private readonly purchaseId: string,
        private readonly products: Product[],
        private readonly userId: string,
    ){}
}

type Product = {
    productId: string;
    totalStock: number;
}