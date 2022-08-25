import { PurchaseDTO } from "../../dtos/purchase.dto";
import { UserDTO } from "../../dtos/user.dto";

export class CreatePurchaseCommand {

    constructor(
        public readonly companyId: string,
        public readonly purchase: PurchaseDTO,
        public readonly user: UserDTO
    ){}

}