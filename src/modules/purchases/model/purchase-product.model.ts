import { PurchaseProductStock } from "./purchase-product-stock.model";

export class PurchaseProduct {

    readonly companyId: string;
    readonly id: string;

    readonly amount: number;
    readonly name: string;
    readonly price: number;
    readonly priceWithDiscount: number;
    readonly productInternalId: string;
    readonly stock: PurchaseProductStock;
    readonly totalPrice: number;
    readonly unit: string;
    readonly weight: number;

    constructor(param: PurchaseParam) {
        this.companyId = param.companyId;
        this.id = param.id;

        this.amount = param.amount;
        this.name = param.name;
        this.price = param.price;
        this.priceWithDiscount = param.priceWithDiscount;
        this.productInternalId = param.productInternalId;
        this.stock = param.stock;
        this.totalPrice = this.calculateTotalPrice();
        this.unit = param.unit;
        this.weight = param.weight;
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
    productInternalId: string;
    stock: PurchaseProductStock;
    unit: string;
    weight: number;
}

type Address = {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    zipCode: string;
    city: string;
    state: string;
    latitude?: number;
    longitude?: number;
}