import { FindCreditCards, FindCreditCardsResponse, MakePayment, MakePaymentBySavedCreditCard, PayByCreditCardResponse, PaymentGateway } from "../payment-gateway.interface";
import { Cielo, EnumBrands, EnumCardType } from "cielo";
import { BadRequestException, NotImplementedException } from "@nestjs/common";
import { PaymentMethodsRepository } from "./payment-methods.repository";

export class CieloRepository implements PaymentGateway {

    constructor(
        private cielo: Cielo,
        private paymentMethodsRepository?: PaymentMethodsRepository
    ){
        this.paymentMethodsRepository = paymentMethodsRepository || new PaymentMethodsRepository();
    }

    deleteCreditCard(id: string) {
        
    }

    findCreditCardById(id: string): Promise<FindCreditCardsResponse> {
        return null;
    }

    findCreditCards(find: FindCreditCards): Promise<FindCreditCardsResponse[]> {
        return this.paymentMethodsRepository.findByUser(find.userId);
    }

    async payByCreditCard(payment: MakePayment): Promise<PayByCreditCardResponse> {
        const tokenizedCard = await this.createTokenizedCard(payment);

        const cardToken = tokenizedCard.cardToken;
        const transaction = await this.createCreditCardTransaction(payment, cardToken);
        
        const id = await this.savePaymentDetails(payment, cardToken);

        return {
            cardDetails: {
                brand: payment.creditCard.cardFlag,
                exp_month: parseInt(payment.creditCard.cardMonth),
                exp_year: parseInt(payment.creditCard.cardYear),
                id,
                last4: this.createLast4Card(payment)
            },
            id: transaction.payment.paymentId,
            receiptUrl: "",
            status: "success"
        };
    }

    payBySavedCreditCard(payment: MakePaymentBySavedCreditCard): Promise<PayByCreditCardResponse> {
        throw new NotImplementedException("Not implemented");
    }

    private async savePaymentDetails(payment: MakePayment, cardToken: string) {
        return await this.paymentMethodsRepository.savePaymentDetails({
            billingAddress: this.createCustomerAddress(payment),
            creditCard: {
                ...this.createCreditCard(payment, cardToken),
                brand: payment.creditCard.cardFlag
            },
            gateway: 'CIELO',
            isRemoved: false,
            user: {
                email: payment.user.email,
                id: payment.user.id
            }
        });
    }
    
    private createLast4Card(payment: MakePayment){
        return payment.creditCard.cardNumber.substring(payment.creditCard.cardNumber.length-4);
    }

    private createTokenizedCard(payment: MakePayment) {
        const params = {
            brand: this.getCreditCardBrand(payment),
            cardNumber: payment.creditCard.cardNumber.replace(/[^\d]/g, ''),
            customerName: payment.user.email,
            expirationDate: `${payment.creditCard.cardMonth}/${payment.creditCard.cardYear}`,
            holder: payment.creditCard.cardHolder
        };
        return this.cielo.card.createTokenizedCard(params).catch(() => {
            throw new BadRequestException("Dados do cartão inválidos");
        });
    }

    private createCreditCardTransaction(payment: MakePayment, cardToken: string) {
        let params = {
            customer: this.createPaymentCustomer(payment),
            merchantOrderId: payment.purchaseId,
            payment: {
                amount: payment.totalPrice,
                creditCard: this.createCreditCard(payment, cardToken),
                installments: 1,
                softDescriptor: "RiccoAlimento",
                type: EnumCardType.CREDIT,
                capture: true
            }
        };
        return this.cielo.creditCard.transaction(params).catch(error => {
            throw new BadRequestException(error.response?.Message);
        });
    }

    private getCreditCardBrand(payment: MakePayment) {
        return EnumBrands.MASTER;
    }

    private createPaymentCustomer(payment: MakePayment) {
        return {
            address: this.createCustomerAddress(payment),
            email: payment.user.email
        };
    }

    private createCustomerAddress(payment: MakePayment) {
        return {
            city: payment.billingAddress.city,
            complement: payment.billingAddress.complement,
            country: "BR",
            district: payment.billingAddress.neighborhood,
            number: payment.billingAddress.number,
            state: payment.billingAddress.state,
            street: payment.billingAddress.street,
            zipCode: payment.billingAddress.zipCode.replace(/[^\d]/g, '')
        };
    }

    private createCreditCard(payment: MakePayment, cardToken: string) {
        return {
            cardToken,
            securityCode: payment.creditCard.cardCvc,
            brand: this.getCreditCardBrand(payment),
            last4: this.createLast4Card(payment),
            exp_month: parseInt(payment.creditCard.cardMonth),
            exp_year: parseInt(payment.creditCard.cardYear),
        };
    }

}