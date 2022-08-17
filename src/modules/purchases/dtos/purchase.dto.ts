export type PurchaseDTO = {
    deliveryAddress: PurchaseAddressDTO;
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
    latitude: number;
    longitude: number;
}

export type PurchaseProductDTO = {
    amount: number;
    productId: string;
    stockOptionId: string;
}

export type PaymentDTO = {
    type: string;
}