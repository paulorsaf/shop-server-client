export class Payment {

    public error: any;
    private readonly receiptUrl: string;
    private readonly type: string;

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