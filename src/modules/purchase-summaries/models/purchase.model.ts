import { Address } from "../../../models/address.model";

export class Purchase {
    
    readonly id: string;
    readonly address: Address;
    readonly companyId: string;
    readonly createdAt: string;
    readonly payment: Payment;
    readonly price: Price;
    readonly products: PurchaseProduct[];
    readonly status: string;
    readonly user: User;

    constructor(params: PurchaseParams){
        this.id = params.id;
        this.address = params.address;
        this.companyId = params.companyId;
        this.createdAt = params.createdAt;
        this.payment = params.payment;
        this.price = params.price;
        this.products = params.products;
        this.status = params.status;
        this.user = params.user;
    }

}

type Payment = {
    cupom: string;
    error: string;
    receiptUrl: string;
    type: string;
}

type Price = {
    totalWithPaymentFee: number;
}

type PurchaseProduct = {
    id: string;
    amount: number;
    name: string;
    price: number;
    priceWithDiscount: number;
}

type User = {
    email: string;
    id: string;
}

type PurchaseParams = {
    id?: string;
    address?: Address;
    companyId?: string;
    createdAt?: string;
    payment?: Payment;
    price?: Price;
    products?: PurchaseProduct[];
    status?: string;
    user?: User;
}