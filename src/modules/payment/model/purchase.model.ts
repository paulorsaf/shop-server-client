import { Payment } from "./payment.model";

export class Purchase {

    private readonly companyId: string;
    readonly id: string;
    readonly payment: Payment;

    constructor(params: PurchaseParams){
        this.companyId = params.companyId;
        this.payment = params.payment;
        this.id = params.id;
    }
}

type PurchaseParams = {
    companyId: string;
    payment?: Payment;
    id: string;
}