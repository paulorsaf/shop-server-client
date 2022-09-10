
export type PaymentDTO = {
    billingAddress?: AddressDTO;
    creditCard?: CreditCardDTO;
    receipt?: string;
    type: string;
}

export type AddressDTO = {
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

export type CreditCardDTO = {
    cardFlag: string;
    cardHolder: string;
    cardNumber: string;
    cardMonth: string;
    cardYear: string;
    cardCvc: string;
}