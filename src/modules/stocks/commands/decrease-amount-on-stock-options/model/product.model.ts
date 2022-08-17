import { Injectable } from "@nestjs/common";
import { Stock } from "./stock.model";

@Injectable()
export class Product {

    private readonly amount: number;
    private readonly id: string;
    private readonly stock: Stock;
    
    #totalStock: number;
    
    constructor(params: ProductParams){
        this.id = params.productId;
        this.stock = params.stock;
        this.amount = params.amount;
    }

    async decreaseAmountOnStock() {
        await this.stock.descreaseQuantityBy(this.amount);
    }

    getAmount() {
        return this.amount;
    }
    getId() {
        return this.id;
    }
    getStock() {
        return this.stock;
    }
    getTotalStock() {
        return this.#totalStock;
    }

}

type ProductParams = {
    amount: number;
    productId: string,
    stock: Stock;
}