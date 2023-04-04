import { FindById, FindCreditCards, FindCreditCardsResponse, MakePayment, MakePaymentBySavedCreditCard, PayByCreditCardResponse, PaymentGateway } from "../payment-gateway.interface";
import { Cielo, CreditCardModel, EnumBrands, EnumCardType, TransactionCreditCardRequestModel } from "cielo";
import { BadRequestException, InternalServerErrorException, NotImplementedException } from "@nestjs/common";
import { PaymentMethodsRepository } from "./payment-methods.repository";
import { Address } from "../../../../../models/address.model";
import { PaymentDB } from "src/db/payment.db";

export class CieloRepository implements PaymentGateway {

    constructor(
        private cielo: Cielo,
        private paymentMethodsRepository?: PaymentMethodsRepository
    ){
        this.paymentMethodsRepository = paymentMethodsRepository || new PaymentMethodsRepository();
    }

    deleteCreditCard(id: string) {
        return this.paymentMethodsRepository.deleteById(id);
    }

    findCreditCardById(find: FindById): Promise<FindCreditCardsResponse> {
        return this.paymentMethodsRepository.findByIdAndUser({
            id: find.id, userId: find.userId
        }).then(response => ({
            brand: response.creditCard.brand,
            exp_month: response.creditCard.exp_month,
            exp_year: response.creditCard.exp_year,
            id: find.id,
            last4: response.creditCard.last4
        }));
    }

    findCreditCards(find: FindCreditCards): Promise<FindCreditCardsResponse[]> {
        return this.paymentMethodsRepository.findByUser(find.userId);
    }

    async payByCreditCard(payment: MakePayment): Promise<PayByCreditCardResponse> {
        const tokenizedCard = await this.createTokenizedCard(payment);
        const cardToken = tokenizedCard.cardToken;

        let params = this.fromMakePaymentToTransactionCreditCardRequestModel(payment, cardToken);
        const transaction = await this.cielo.creditCard.transaction(params).catch(error => {
            throw new BadRequestException(error.response?.Message);
        });
        
        const id = await this.savePaymentDetails(payment, cardToken);

        return {
            cardDetails: {
                brand: payment.creditCard.cardFlag,
                exp_month: parseInt(payment.creditCard.cardMonth),
                exp_year: parseInt(payment.creditCard.cardYear),
                id,
                last4: this.getCardLast4(payment.creditCard.cardNumber)
            },
            id: transaction.payment.paymentId,
            receiptUrl: "",
            status: "success"
        };
    }

    async payBySavedCreditCard(payment: MakePaymentBySavedCreditCard): Promise<PayByCreditCardResponse> {
        const paymentDetails = await this.paymentMethodsRepository.findByIdAndUser({
            id: payment.id, userId: payment.user.id
        })
        if (!paymentDetails) {
            throw new InternalServerErrorException("Cartão não encontrado");
        }

        const data = this.fromMakePaymentBySavedCreditCardToTransactionCreditCardRequestModel(
            paymentDetails, payment.purchaseId, payment.totalPrice
        )
        const transaction = await this.cielo.creditCard.transaction(data)
            .then(response => {
                if (response.payment.status !== PaymentStatus.PaymentConfirmed) {
                    throw new InternalServerErrorException(response.payment.returnMessage)
                }
                return response;
            })
            .catch(error => {
                throw new BadRequestException(error.response?.Message || error.response?.message || error.message);
            });

        return Promise.resolve({
            cardDetails: {
                brand: paymentDetails.creditCard.brand,
                exp_month: paymentDetails.creditCard.exp_month,
                exp_year: paymentDetails.creditCard.exp_year,
                id: payment.id,
                last4: paymentDetails.creditCard.last4
            },
            id: transaction.payment.paymentId,
            receiptUrl: "",
            status: "success"
        });
    }

    private fromMakePaymentToTransactionCreditCardRequestModel(payment: MakePayment, cardToken: string) {
        return this.createTransactionCreditCardRequestModel({
            billingAddress: payment.billingAddress,
            cardToken,
            creditCard: {
                securityCode: payment.creditCard.cardCvc,
                brand: this.getCreditCardBrand(payment)
            },
            email: payment.user.email,
            purchaseId: payment.purchaseId,
            totalPrice: payment.totalPrice
        });
    }

    private fromMakePaymentBySavedCreditCardToTransactionCreditCardRequestModel(
        paymentDetails: PaymentDB, purchaseId: string, totalPrice: number
    ): TransactionCreditCardRequestModel {
        return this.createTransactionCreditCardRequestModel({
            billingAddress: paymentDetails.billingAddress,
            cardToken: paymentDetails.creditCard.cardToken,
            creditCard: {
                brand: this.getCreditCardBrand(paymentDetails.creditCard.brand),
                securityCode: paymentDetails.creditCard.securityCode,
                cardToken: paymentDetails.creditCard.cardToken
            },
            email: paymentDetails.user.email,
            purchaseId: purchaseId,
            totalPrice: totalPrice
        });
    }

    private async savePaymentDetails(payment: MakePayment, cardToken: string) {
        return await this.paymentMethodsRepository.savePaymentDetails({
            billingAddress: this.createBillingAddress(payment.billingAddress),
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
    
    private getCardLast4(cardNumber: string){
        return cardNumber.substring(cardNumber.length-4);
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

    private createTransactionCreditCardRequestModel(
        transaction: Transaction
    ): TransactionCreditCardRequestModel {
        return {
            customer: this.createPaymentCustomer(transaction.billingAddress, transaction.email),
            merchantOrderId: transaction.purchaseId,
            payment: {
                amount: transaction.totalPrice,
                creditCard: {
                    ...transaction.creditCard,
                    cardToken: transaction.cardToken
                },
                installments: 1,
                softDescriptor: "RiccoAlimento",
                type: EnumCardType.CREDIT,
                capture: true
            }
        }
    }

    private getCreditCardBrand(payment: MakePayment) {
        return EnumBrands.MASTER;
    }

    private createPaymentCustomer(address: Address, email: string) {
        return {
            address: this.createCustomerAddress(address),
            email: email
        };
    }

    private createCustomerAddress(billingAddress: Address) {
        return {
            city: billingAddress.city,
            complement: billingAddress.complement,
            country: "BR",
            district: billingAddress.neighborhood,
            number: billingAddress.number,
            state: billingAddress.state,
            street: billingAddress.street,
            zipCode: billingAddress.zipCode?.replace(/[^\d]/g, '')
        };
    }

    private createBillingAddress(billingAddress: Address) {
        return {
            city: billingAddress.city,
            complement: billingAddress.complement,
            country: "BR",
            neighborhood: billingAddress.neighborhood,
            number: billingAddress.number,
            state: billingAddress.state,
            street: billingAddress.street,
            zipCode: billingAddress.zipCode?.replace(/[^\d]/g, '')
        };
    }

    private createCreditCard(payment: MakePayment, cardToken: string) {
        return {
            cardToken,
            securityCode: payment.creditCard.cardCvc,
            brand: this.getCreditCardBrand(payment),
            last4: this.getCardLast4(payment.creditCard.cardNumber),
            exp_month: parseInt(payment.creditCard.cardMonth),
            exp_year: parseInt(payment.creditCard.cardYear),
        };
    }

}

type Transaction = {
    cardToken: string;
    billingAddress: Address;
    creditCard: CreditCardModel;
    email: string;
    purchaseId: string;
    totalPrice: number;
}

enum PaymentStatus {
    NotFinished = 0,
    Authorized = 1,
    PaymentConfirmed = 2,
    Declined = 3,
    Voided = 10,
    Refunded = 11,
    Pending = 12,
    Aborted = 13,
    Schedule = 20,
}