export class BannerDTO {
    constructor(
        public readonly name: string,
        public readonly id: string,
        public readonly image: string,
        public readonly price: number,
        public readonly priceWithDiscount: number
    ){}
}