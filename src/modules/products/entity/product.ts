export class Product {
    constructor(
        public readonly companyId: string,
        public readonly id: string,
        public readonly name: string,
        public readonly price: number,
        public readonly priceWithDiscount: number,
        public readonly images: ProductImage
    ){}
}

export class ProductImage {
    constructor(
        public readonly fileName: string,
        public readonly imageUrl: string
    ){}
}