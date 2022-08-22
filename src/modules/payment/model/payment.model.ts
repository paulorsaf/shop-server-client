export class Payment {

    public error: any;
    receiptUrl: string;
    readonly type: string;

    constructor(params: PaymentParams){
        this.error = params.error;
        this.receiptUrl = params.receiptUrl;
        this.type = params.type;
    }

}

type PaymentParams = {
    error?: any;
    receiptUrl?: string;
    type: string;
}