import { Payment } from "../payment/payment.model";

export class PurchasePayment {

    readonly companyId: string;
    readonly id: string;
    readonly payment: Payment;
    readonly userId: string;

    constructor(param: PurchaseParam){
        this.companyId = param.companyId;
        this.id = param.id;
        this.payment = param.payment;
        this.userId = param.userId;
    }

}

type PurchaseParam = {
    companyId: string;
    id: string;
    payment: Payment;
    userId: string;
}