import { NotFoundException } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { PurchaseRepository } from "../../repositories/purchase.repository";
import { FindPurchaseByIdQuery } from "./find-purchase-by-id.query";

@QueryHandler(FindPurchaseByIdQuery)
export class FindPurchaseByIdQueryHandler implements IQueryHandler<FindPurchaseByIdQuery> {

    constructor(
        private purchaseRepository: PurchaseRepository
    ){}

    async execute(query: FindPurchaseByIdQuery) {
        const purchase = await this.purchaseRepository.findByIdAndCompanyId({
            companyId: query.companyId, purchaseId: query.purchaseId
        });
        if (!purchase) {
            throw new NotFoundException("Compra nao encontrada");
        }
        if (query.userId !== purchase.user.id) {
            throw new NotFoundException("Compra nao encontrada");
        }

        return purchase;
    }
    
}