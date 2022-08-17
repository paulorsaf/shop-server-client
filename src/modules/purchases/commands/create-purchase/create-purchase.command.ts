import { User } from "../../../../authentication/model/user";
import { Company } from "../../../../authentication/model/company";
import { Purchase } from "../../model/purchase.model";

export class CreatePurchaseCommand {

    constructor(
        public readonly company: Company,
        public readonly purchase: Purchase,
        public readonly user: User
    ){}

}