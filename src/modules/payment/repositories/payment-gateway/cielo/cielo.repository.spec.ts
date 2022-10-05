import { BadRequestException } from "@nestjs/common";
import { MakePayment } from "../payment-gateway.interface";
import { CieloRepository } from "./cielo.repository"

describe('Cielo repository', () => {

    let cielo: CieloMock;
    let paymentMethodsRepository: PaymentMethodsRepositoryMock;
    let repository: CieloRepository;

    beforeEach(() => {
        cielo = new CieloMock();
        paymentMethodsRepository = new PaymentMethodsRepositoryMock();
        repository = new CieloRepository(cielo as any, paymentMethodsRepository as any);
    })

    describe('given pay by credit card', () => {

        let payment: MakePayment;

        beforeEach(() => {
            payment = {
                billingAddress: {zipCode: "anyZipCode"} as any,
                companyId: "TOQx2rIfbZ5tav2nS2fg",
                creditCard: {
                    cardNumber: "4111 1111 1111 1111",
                    cardCvc: "123",
                    cardFlag: "VISA",
                    cardHolder: "nome teste",
                    cardMonth: "12",
                    cardYear: "2023"
                },
                purchaseId: "anyPurchaseId",
                totalPrice: 15,
                user: {
                    email: "testing@email.com",
                    id: "anyUserId"
                }
            };

            cielo._createTokenizedCardResponse = Promise.resolve({});
            cielo._createCreditCardTransactionResponse = Promise.resolve({
                payment: {
                    creditCard: {cardNumber: "1234"},
                    paymentId: "anyPaymentId",
                    tid: "anyTransactionId"
                }
            });
        })

        describe('when payment success', () => {
        
            it('then save payment', async () => {
                await repository.payByCreditCard(payment);
    
                expect(paymentMethodsRepository._isSaved).toBeTruthy();
            })
        
            it('then make payment', async () => {
                const response = await repository.payByCreditCard(payment);
    
                expect(response).toEqual({
                    cardDetails: {
                        brand: "VISA",
                        exp_month: 12,
                        exp_year: 2023,
                        id: "anyPaymentDetailsId",
                        last4: "1111"
                    },
                    id: "anyPaymentId",
                    receiptUrl: "",
                    status: "success"
                });
            })

        })

        describe('when error on create card', () => {

            beforeEach(() => {
                cielo._createTokenizedCardResponse = Promise.reject({response: {message: 'error'}});
            })

            it('then do not save payment', async () => {
                try {
                    await repository.payByCreditCard(payment);
                } catch (e){}
    
                expect(paymentMethodsRepository._isSaved).toBeFalsy();
            })

            it('then throw bad request exception', async () => {
                await expect(repository.payByCreditCard(payment))
                    .rejects.toThrowError(BadRequestException);
            })

        })

        describe('when error on create card transaction', () => {

            beforeEach(() => {
                cielo._createCreditCardTransactionResponse = Promise.reject({response: {message: 'error'}});
            })

            it('then do not save payment', async () => {
                try {
                    await repository.payByCreditCard(payment);
                } catch (e){}
    
                expect(paymentMethodsRepository._isSaved).toBeFalsy();
            })

            it('then throw bad request exception', async () => {
                await expect(repository.payByCreditCard(payment))
                    .rejects.toThrowError(BadRequestException);
            })

        })

    })

})

class CieloMock {
    _hasCreatedTokenizedCard = false;
    _hasCreatedCreditCardTransaction = false;

    _createTokenizedCardResponse;
    _createCreditCardTransactionResponse;

    card = {
        createTokenizedCard: () => {
            this._hasCreatedTokenizedCard = true;
            return this._createTokenizedCardResponse;
        }
    }
    creditCard = {
        transaction: () => {
            this._hasCreatedCreditCardTransaction = true;
            return this._createCreditCardTransactionResponse;
        }
    }
}

class PaymentMethodsRepositoryMock {
    _isSaved = false;
    savePaymentDetails() {
        this._isSaved = true;
        return "anyPaymentDetailsId";
    }
}