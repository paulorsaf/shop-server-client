import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { CalculatePurchasePriceQuery } from "./calculate-purchase-price.query";
import { PurchasePriceService } from "../../../../services/purchase-price.service";

@QueryHandler(CalculatePurchasePriceQuery)
export class CalculatePurchasePriceQueryHandler implements IQueryHandler<CalculatePurchasePriceQuery> {

    constructor(
        private purchasePriceService: PurchasePriceService
    ){}

    async execute(query: CalculatePurchasePriceQuery) {
        return this.purchasePriceService.calculatePrice(query.dto);
    }
    
}