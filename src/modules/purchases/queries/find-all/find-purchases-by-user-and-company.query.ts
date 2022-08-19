import { Purchase } from "../../model/purchase.model";

export class FindPurchasesByUserAndCompanyQuery {
    constructor(
        public readonly purchase: Purchase
    ){}
}