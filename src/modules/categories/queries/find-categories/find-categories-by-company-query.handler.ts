import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Category } from "../../entity/category";
import { CategoryRepository } from "../../repositories/category.repository";
import { FindCategoriesByCompany } from "./find-categories-by-company.query";

@QueryHandler(FindCategoriesByCompany)
export class FindCategoriesByCompanyQueryHandler implements IQueryHandler<FindCategoriesByCompany> {

    constructor(
        private categoryRepository: CategoryRepository
    ){}

    async execute(query: FindCategoriesByCompany): Promise<Category[]> {
        return this.categoryRepository.findByCompany(query.companyId);
    }

}