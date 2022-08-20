export class Payment {

    receipt: string;
    type: string;

    constructor(params: PaymentParams){
        this.receipt = params.receipt;
        this.type = params.type;
    }

}

type PaymentParams = {
    receipt?: string;
    type: string;
}