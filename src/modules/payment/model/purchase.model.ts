import { Payment } from "./payment.model";

export class Purchase {

    readonly companyId: string;
    readonly id: string;
    readonly payment: Payment;
    readonly price: Price;
    readonly user: User;

    constructor(params: PurchaseParams){
        this.companyId = params.companyId;
        this.id = params.id;
        this.payment = params.payment;
        this.price = params.price;
        this.user = params.user;
    }

}

type PurchaseParams = {
    companyId?: string;
    payment?: Payment;
    id?: string;
    price?: Price;
    user?: User;
}

type User = {
    email: string,
    id: string
}

type Price = {
    products: number;
    delivery: number;
    paymentFee: number;
    total: number;
    totalWithPaymentFee: number;
}