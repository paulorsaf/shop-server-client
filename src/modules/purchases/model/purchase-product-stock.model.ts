export class PurchaseProductStock {

    private readonly companyId: string;
    private readonly productId: string;
    readonly id: string;
    private readonly color: string;
    readonly quantity: number;
    private readonly size: string;

    constructor(params: StockParams){
        this.color = params.color;
        this.companyId = params.companyId;
        this.id = params.id;
        this.productId = params.productId;
        this.quantity = params.quantity;
        this.size = params.size;
    }

}

type StockParams = {
    companyId: string;
    productId: string;
    id: string;
    color?: string;
    quantity?: number;
    size?: string;
}