import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PurchaseRepository } from "../../repositories/purchase.repository";
import { FindPurchasesByUserAndCompanyQuery } from "./find-purchases-by-user-and-company.query";

@QueryHandler(FindPurchasesByUserAndCompanyQuery)
export class FindPurchasesByUserAndCompanyQueryHandler implements IQueryHandler<FindPurchasesByUserAndCompanyQuery> {

    constructor(
        private purchaseRepository: PurchaseRepository
    ){}

    async execute(query: FindPurchasesByUserAndCompanyQuery) {
        return await this.purchaseRepository.findAllByUserAndCompany(query);
    }
    
}