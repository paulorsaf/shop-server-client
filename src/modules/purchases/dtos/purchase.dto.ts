export type PurchaseDTO = {
    deliveryAddress: PurchaseAddressDTO;
    deliveryPrice: number;
    payment: PaymentDTO;
    products: PurchaseProductDTO[];
}

export type PurchaseAddressDTO = {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    zipCode: string;
    city: string;
    state: string;
    latitude?: number;
    longitude?: number;
}

export type PurchaseProductDTO = {
    amount: number;
    productId: string;
    stockOptionId: string;
}

export type PaymentDTO = {
    billingAddress?: PurchaseAddressDTO;
    creditCard?: CreditCardDTO;
    receipt?: string;
    type: string;
}

export type CreditCardDTO = {
    cardFlag: string;
    cardHolder: string;
    cardNumber: string;
    cardMonth: string;
    cardYear: string;
    cardCvc: string;
}