import { CalculatePriceDTO } from "../../dtos/calculate-price.dto"

export class CalculatePurchasePriceQuery {
    constructor(
        public readonly dto: CalculatePriceDTO
    ){}
}