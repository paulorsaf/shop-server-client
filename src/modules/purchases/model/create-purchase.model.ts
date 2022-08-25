import { CreatePurchaseProduct } from "./create-purchase-product.model";

export class CreatePurchase {

    readonly id: string;
    readonly companyId: string;

    readonly createdAt: string;
    readonly payment: Payment;
    readonly products: CreatePurchaseProduct[];
    readonly status: string;
    readonly user: User;

    constructor(param: PurchaseParam) {
        this.id = param.id;
        this.companyId = param.companyId;

        this.createdAt = param.createdAt;
        this.payment = param.payment
        this.products = param.products;
        this.status = param.status;
        this.user = param.user;
    }

}

type PurchaseParam = {
    id?: string;
    companyId: string;

    address?: Address;
    createdAt?: string;
    payment?: Payment;
    products?: CreatePurchaseProduct[];
    status?: string;
    user?: User;
}

type User = {
    email: string;
    id: string;
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

type Payment = {
    error?: any;
    receiptUrl?: string;
    type: string;
}