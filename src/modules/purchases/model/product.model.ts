import { Injectable, NotFoundException } from "@nestjs/common";
import { ProductDoesntBelongToCompanyException, ProductNotFoundException, StockNotFoundException } from "../exceptions/purchase.exceptions";
import { ProductRepository } from "../repositories/product.repository";
import { Stock } from "./stock.model";

@Injectable()
export class Product {

    private id: string;
    private name: string;
    private price: number;
    private priceWithDiscount: number;
    private description: string;
    private stock: Stock;
    private amount: number;

    #companyId: string;
    #productRepository: ProductRepository;
    
    constructor(
        companyId: string,
        productId: string,
        amount: number,
        stock?: Stock,
        name?: string,
        price?: number,
        priceWithDiscount?: number,
        description?: string,
        productRepository?: ProductRepository
    ){
        this.#companyId = companyId;
        this.id = productId;
        this.amount = amount;
        this.stock = stock;
        this.name = name;
        this.price = price;
        this.priceWithDiscount = priceWithDiscount;
        this.description = description;
        this.#productRepository = productRepository || new ProductRepository();
    }

    async find() {
        if (!this.stock) {
            throw new StockNotFoundException(this.name);
        }

        return this.#productRepository.findById(this.id).then(product => {
            if (!product) {
                throw new ProductNotFoundException(this.name);
            }
            if (product.companyId !== this.#companyId) {
                throw new ProductDoesntBelongToCompanyException(this.name);
            }

            this.name = product.name;
            this.price = product.price;
            this.priceWithDiscount = product.priceWithDiscount;
            this.description = product.description;
        }).then(async () => await this.setStock())
    }

    isOutOfStock() {
        if (this.amount > this.stock.getQuantity()) {
            return true;
        }
        return false;
    }

    getAmount() {
        return this.amount;
    }
    getId() {
        return this.id;
    }
    getName() {
        return this.name;
    }
    getStock() {
        return this.stock;
    }

    private async setStock() {
        await this.stock.findByProductAndId();

        if (!this.stock.hasStock()) {
            throw new StockNotFoundException(this.name);
        }

        return this;
    }

}