export type CompanyDb = {
    aboutUs: string;
    address: Address;
    id: string;
    logo: Image;
    payment: Payment;
    name: string;
    facebook: string;
    instagram: string;
    website: string;
    whatsapp: string;
    chatId: string;
}

type Address = {
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

export type Image = {
    imageUrl: string;
}

export type Payment = {
    creditCard: CreditCardPayment;
    money: boolean;
    pixKey: string;
}

export type CreditCardPayment = {
    flags: string[]
    fee?: {
        percentage: number;
        value: number;
    }
}