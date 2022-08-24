import { CreatePurchaseProductStock } from "./create-purchase-product-stock.model";

export class CreatePurchaseProduct {

    readonly companyId: string;
    readonly id: string;

    readonly amount: number;
    readonly name: string;
    readonly stock: CreatePurchaseProductStock;

    constructor(param: PurchaseParam) {
        this.companyId = param.companyId;
        this.id = param.id;

        this.amount = param.amount;
        this.name = param.name;
        this.stock = param.stock;
    }

    hasEnoughItemsOnStock() {
        if (this.amount > this.stock.quantity) {
            return false;
        }
        return true;
    }

}

type PurchaseParam = {
    address?: Address;
    amount?: number;
    companyId: string;
    id: string;
    name?: string;
    stock: CreatePurchaseProductStock;
}

type Payment = {
    type: string;
}

export type Address = {
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