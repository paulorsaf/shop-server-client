export class Product {
    constructor(
        public readonly id: string,
        public readonly images: ProductImage[],
        public readonly name: string,
        public readonly price: number,
        public readonly priceWithDiscount: number
    ){}
}

export type ProductImage = {
    fileName: string;
    imageUrl: string
}