import { PurchaseDTO } from "../../dtos/purchase.dto";
import { UserDTO } from "../../dtos/user.dto";

export class CreatePurchaseCommand {

    constructor(
        public readonly company: CompanyDTO,
        public readonly purchase: PurchaseDTO,
        public readonly user: UserDTO
    ){}

}

type CompanyDTO = {
    cityDeliveryPrice: number;
    companyCity: string;
    id: string;
    payment: Payment;
    zipCode: string;
}

type Payment = {
    readonly creditCard: {
        readonly fee: {
            readonly percentage: number;
            readonly value: number;
        }
    }
}