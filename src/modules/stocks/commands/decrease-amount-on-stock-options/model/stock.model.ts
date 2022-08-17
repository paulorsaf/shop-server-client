import { Injectable } from "@nestjs/common";
import { StockRepository } from "../../../repositories/stock.repository";

@Injectable()
export class Stock {
    
    #id: string;

    #quantity?: number;
    
    #stockRepository: StockRepository;
    
    constructor(params: StockParams){
        this.#id = params.id;
        this.#quantity = params.quantity;
        this.#stockRepository = params.stockRepository || new StockRepository();
    }

    descreaseQuantityBy(amount: number) {
        return this.#stockRepository.descreaseQuantityBy({
            id: this.#id, decreaseBy: amount
        }).then(decreasedBy => {
            this.#quantity += decreasedBy;
        })
    }

    getId() {
        return this.#id;
    }
    getQuantity() {
        return this.#quantity;
    }

}

type StockParams = {
    id: string,
    quantity: number;
    stockRepository?: StockRepository
}