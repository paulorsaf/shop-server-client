import { Address } from "../../../models/address.model";

export class DailyPurchasesSummary {
    
    readonly id: string;
    readonly address: Address;
    readonly companyId: string;
    readonly date: string;
    readonly purchases: DailyPurchases;

    constructor(params: PurchaseParams){
        this.id = params.id;
        this.companyId = params.companyId;
        this.date = params.date;
        this.purchases = params.purchases;
    }

}

export type DailyPurchases = {
    [purchaseId: string]: PurchaseSummary;
}

export type PurchaseSummary = {
    createdAt: string;
    id: string;
    payment: {
        cupom: string;
        error: string;
        type: string;
    },
    price: number;
    products: PurchaseSummaryProduct[];
    status: string;
    user: {
        id: string,
        email: string
    }
}

export type PurchaseSummaryProduct = {
    id: string;
    amount: number;
    name: string;
    price: number;
    priceWithDiscount: number;
}

type PurchaseParams = {
    id?: string;
    companyId?: string;
    date?: string;
    purchases?: DailyPurchases;
}