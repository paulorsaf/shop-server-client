export class ProductsPurchasedDecreasedStockEvent {
    private readonly eventType = "PRODUCTS_PURCHASED_DECREASED_STOCK_EVENT";

    constructor(
        public readonly companyId: string,
        public readonly purchaseId: string,
        public readonly products: ProductStock[],
        public readonly userId: string
    ){}
}

type ProductStock = {
    readonly amount: number,
    readonly productId: string,
    readonly stockId: string
}