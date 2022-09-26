export type PurchaseDTO = {
    deliveryAddress: PurchaseAddressDTO;
    deliveryPrice: number;
    payment: PaymentDTO;
    productNotes: ProductNotes[];
    products: PurchaseProductDTO[];
}

export type ProductNotes = {
    notes: string;
    productId: string;
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
    creditCardId?: string;
    cupom: string;
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