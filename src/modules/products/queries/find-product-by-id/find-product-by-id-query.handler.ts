import { NotFoundException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ProductRepository } from "../../repositories/product.repository";
import { FindProductByIdQuery } from "./find-product-by-id.query";

@QueryHandler(FindProductByIdQuery)
export class FindProductByIdQueryHandler implements IQueryHandler<FindProductByIdQuery> {

    constructor(
        private productRepository: ProductRepository
    ){}

    async execute(query: FindProductByIdQuery) {
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