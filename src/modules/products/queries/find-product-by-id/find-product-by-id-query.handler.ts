import { NotFoundException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Product } from "../../entity/product";
import { ProductRepository } from "../../repositories/product.repository";
import { StockRepository } from "../../repositories/stock.repository";
import { FindProductByIdQuery } from "./find-product-by-id.query";

@QueryHandler(FindProductByIdQuery)
export class FindProductByIdQueryHandler implements IQueryHandler<FindProductByIdQuery> {

    constructor(
        private productRepository: ProductRepository,
        private stockRepository: StockRepository
    ){}

    async execute(query: FindProductByIdQuery) {
        const product = await this.findProduct(query);

        const stockOptions = await this.stockRepository.findByProduct(query.productId);
        if (stockOptions) {
            return new Product(
                product.companyId, product.id, product.name, product.price,
                product.priceWithDiscount, product.images, stockOptions,
                product.description
            );
        }

        return product;
    }

    private async findProduct(query: FindProductByIdQuery) {
        const product = await this.productRepository.findById(query.productId);
        if (!product) {
            throw new NotFoundException('Produto nao encontrado');
        }
        if (product.companyId !== query.companyId) {
            throw new NotFoundException('Produto nao encontrado');
        }
            
        return product;
    }

}