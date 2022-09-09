import { AddressDTO, CreditCardDTO } from "../../dtos/payment.dto";

export class MakePaymentByCreditCardCommand {
    constructor(
        public readonly companyId: string,
        public readonly purchaseId: string,
        public readonly billingAddress: AddressDTO,
        public readonly creditCard: CreditCardDTO
    ){}
}