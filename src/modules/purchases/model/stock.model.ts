import { Injectable } from "@nestjs/common";
import { StockRepository } from "../repositories/stock.repository";

@Injectable()
export class Stock {
    
    private id: string;
    private quantity?: number;
    private color?: string;
    private size?: string;
    
    #productId: string;
    #stockRepository: StockRepository;
    
    constructor(params: StockParams){
        this.#productId = params.productId;
        this.id = params.id;
        this.quantity = params.quantity;
        this.color = params.color;
        this.size = params.size;
        this.#stockRepository = params.stockRepository || new StockRepository();
    }

    findByProductAndId() {
        return this.#stockRepository.findByIdAndProduct(this.id, this.#productId).then(stockDb => {
            if (!stockDb) {
                return;
            }
            this.color = stockDb.color;
            this.quantity = stockDb.quantity;
            this.size = stockDb.size;
        });
    }

    getId() {
        return this.id;
    }
    
    getQuantity() {
        return this.quantity;
    }

    hasStock() {
        return this.quantity > 0;
    }

}

type StockParams = {
    productId: string,
    id: string,
    quantity?: number,
    color?: string,
    size?: string,
    stockRepository?: StockRepository
}