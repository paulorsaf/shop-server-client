export class Purchase {
    constructor(
        public readonly companyId: string,
        public readonly userId: string,
        public readonly products: PurchaseProduct[],
        public readonly paymentType: string,
        public readonly status: string
    ){}
}

export class PurchaseProduct {
    constructor(
        public readonly productId: string,
        public readonly amount: number,
        public readonly description: string,
        public readonly price: number,
        public readonly priceWithDiscount: number,
        public readonly name: string,
        public readonly stockOption?: PurchaseStockOption
    ){}
}

export class PurchaseStockOption {
    constructor(
        public readonly id: string,
        public readonly color: string,
        public readonly size: string
    ){}
}