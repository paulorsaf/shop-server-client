import { PurchaseProductStock } from "./purchase-product-stock.model";

export class PurchaseProduct {

    readonly companyId: string;
    readonly id: string;

    readonly amount: number;
    readonly name: string;
    readonly price: number;
    readonly priceWithDiscount: number;
    readonly stock: PurchaseProductStock;
    readonly totalPrice: number;

    constructor(param: PurchaseParam) {
        this.companyId = param.companyId;
        this.id = param.id;

        this.amount = param.amount;
        this.name = param.name;
        this.price = param.price;
        this.priceWithDiscount = param.priceWithDiscount;
        this.stock = param.stock;
        this.totalPrice = this.calculateTotalPrice();
    }

    hasEnoughItemsOnStock() {
        if (this.amount > this.stock.quantity) {
            return false;
        }
        return true;
    }

    private calculateTotalPrice() {
        let price = this.priceWithDiscount || this.price;
        return this.amount * price;
    }

}

type PurchaseParam = {
    address?: Address;
    amount?: number;
    companyId: string;
    id: string;
    name?: string;
    price?: number;
    priceWithDiscount?: number;
    stock: PurchaseProductStock;
}

type Address = {
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