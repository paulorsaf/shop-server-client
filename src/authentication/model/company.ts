export type Company = {
    address: Address;
    cityDeliveryPrice: number;
    id: string;
    name: string
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