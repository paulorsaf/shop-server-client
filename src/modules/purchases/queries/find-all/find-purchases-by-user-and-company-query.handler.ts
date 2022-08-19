import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { Purchase } from "../../model/purchase.model";
import { FindPurchasesByUserAndCompanyQuery } from "./find-purchases-by-user-and-company.query";

@QueryHandler(FindPurchasesByUserAndCompanyQuery)
export class FindPurchasesByUserAndCompanyQueryHandler
    implements IQueryHandler<FindPurchasesByUserAndCompanyQuery> {

    async execute(query: FindPurchasesByUserAndCompanyQuery) {
        return [];
    }
    
}