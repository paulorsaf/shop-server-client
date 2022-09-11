import { AddressDTO, CreditCardDTO } from "../../dtos/payment.dto";

export interface PaymentGateway {

    deleteCreditCard(id: string);
    findCreditCardById(id: string): Promise<FindCreditCardsResponse>;
    findCreditCards(find: FindCreditCards): Promise<FindCreditCardsResponse[]>;
    payByCreditCard(payment: MakePayment): Promise<PayByCreditCardResponse>;
    payBySavedCreditCard(payment: MakePaymentBySavedCreditCard): Promise<PayByCreditCardResponse>;

}

export type FindCreditCards = {
    email: string;
}

export type FindCreditCardsResponse = {
    brand: string;
    exp_month: number;
    exp_year: number;
    id: string;
    last4: string;
}

export type MakePayment = {
    billingAddress: AddressDTO,
    companyId: string,
    creditCard: CreditCardDTO,
    totalPrice: number;
    user: {
        email: string;
    }
}

export type MakePaymentBySavedCreditCard = {
    id: string;
    totalPrice: number;
    user: {
        email: string;
    }
}

export type PayByCreditCardResponse = {
    cardDetails: {
        brand: string;
        exp_month: number;
        exp_year: number;
        id: string;
        last4: string;
    };
    id: string;
    receiptUrl: string;
    status: string;
}