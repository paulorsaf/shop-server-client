import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ProductRepository } from "../../repositories/product.repository";
import { FindProductsByCategoryQuery } from "./find-products-by-category.query";

@QueryHandler(FindProductsByCategoryQuery)
export class FindProductsByCategoryQueryHandler implements IQueryHandler<FindProductsByCategoryQuery> {

    constructor(
        private productRepository: ProductRepository
    ){}

    async execute(query: FindProductsByCategoryQuery): Promise<any[]> {
        return this.productRepository.findByCompanyAndCategory(
            query.companyId, query.categoryId
        );
    }

}