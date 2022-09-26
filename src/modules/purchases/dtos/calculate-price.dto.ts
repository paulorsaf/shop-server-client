export type CalculatePriceDTO = {
    readonly address: Address,
    readonly cityDeliveryPrice: number;
    readonly company: Company;
    readonly cupom: string;
    readonly paymentType: string,
    readonly payment: Payment,
    readonly products: Product[]
}

type Address = {
    readonly destinationZipCode: string;
    readonly originZipCode: string;
}

type Company = {
    readonly id: string;
    readonly city: string;
}

type Payment = {
    readonly creditCard: {
        readonly fee: {
            readonly percentage: number;
            readonly value: number;
        }
    }
}

type Product = {
    readonly amount: number;
    readonly price: number;
    readonly priceWithDiscount?: number;
    readonly weight: number;
}