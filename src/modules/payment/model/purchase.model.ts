import { Payment } from "./payment.model";

export class Purchase {

    readonly companyId: string;
    readonly id: string;
    readonly payment: Payment;
    readonly userId: string;

    constructor(params: PurchaseParams){
        this.companyId = params.companyId;
        this.payment = params.payment;
        this.id = params.id;
        this.userId = params.userId;
    }

}

type PurchaseParams = {
    companyId: string;
    payment?: Payment;
    id: string;
    userId: string;
}