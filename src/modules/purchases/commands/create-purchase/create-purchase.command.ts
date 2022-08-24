import { PurchaseDTO } from "../../dtos/purchase.dto";

export class CreatePurchaseCommand {

    constructor(
        public readonly companyId: string,
        public readonly purchase: PurchaseDTO,
        public readonly user: User
    ){}

}

type User = {
    email: string;
    id: string;
}