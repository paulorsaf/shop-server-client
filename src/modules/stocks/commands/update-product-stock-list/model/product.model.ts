import { ProductRepository } from "../../../repositories/product.repository";

export class Product {

    private readonly id: string;
    
    #productRepository: ProductRepository;
    #totalStock: number;
    
    constructor(params: ProductParams){
        this.id = params.productId;
        this.#productRepository = params.productRepository || new ProductRepository();
    }

    async updateTotalStock() {
        await this.#productRepository.getTotalStockByProduct(this.id).then(total => {
            this.#totalStock = total;
            this.#productRepository.update({id: this.id, totalStock: total});
        })
    }

    getId() {
        return this.id;
    }
    getTotalStock() {
        return this.#totalStock;
    }

}

type ProductParams = {
    productId: string;
    
    productRepository?: ProductRepository,
}