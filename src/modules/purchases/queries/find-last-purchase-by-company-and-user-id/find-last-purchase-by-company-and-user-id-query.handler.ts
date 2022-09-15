import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PurchaseRepository } from "../../repositories/purchase.repository";
import { FindLastPurchaseByCompanyAndUserIdQuery } from "./find-last-purchase-by-company-and-user-id.query";

@QueryHandler(FindLastPurchaseByCompanyAndUserIdQuery)
export class FindLastPurchaseByCompanyAndUserIdQueryHandler implements IQueryHandler<FindLastPurchaseByCompanyAndUserIdQuery> {

    constructor(
        private purchaseRepository: PurchaseRepository
    ){}

    async execute(query: FindLastPurchaseByCompanyAndUserIdQuery) {
        const purchase = await this.purchaseRepository.findByUserIdAndCompanyId({
            companyId: query.companyId, userId: query.userId
        });
        if (!purchase) {
            throw new NotFoundException("Compra nao encontrada");
        }

        return purchase;
    }
    
}