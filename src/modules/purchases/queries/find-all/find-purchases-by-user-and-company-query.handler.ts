import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { FindPurchasesByUserAndCompanyQuery } from "./find-purchases-by-user-and-company.query";

@QueryHandler(FindPurchasesByUserAndCompanyQuery)
export class FindPurchasesByUserAndCompanyQueryHandler
    implements IQueryHandler<FindPurchasesByUserAndCompanyQuery> {

    async execute(query: FindPurchasesByUserAndCompanyQuery) {
        const purchase = query.purchase;
        
        return await purchase.findAllByUserAndCompany();
    }
    
}