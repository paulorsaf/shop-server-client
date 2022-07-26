import { ProductStock } from "./stock";

export class Product {
    constructor(
        public readonly companyId: string,
        public readonly id: string,
        public readonly name: string,
        public readonly price: number,
        public readonly priceWithDiscount: number,
        public readonly images: ProductImage,
        public readonly stock: ProductStock[],
        public readonly description: string,
        public readonly weight: number,
        public readonly unit: string
    ){}
}

export class ProductImage {
    constructor(
        public readonly fileName: string,
        public readonly imageUrl: string
    ){}
}