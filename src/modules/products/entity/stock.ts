export class ProductStock {
    stockOptions: ProductStockOption[];
}

export class ProductStockOption {
    constructor(
        public readonly color: string,
        public readonly id: string,
        public readonly quantity: number,
        public readonly size: string
    ){}
}