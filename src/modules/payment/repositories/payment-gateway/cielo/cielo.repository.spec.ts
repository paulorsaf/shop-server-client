import { BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { MakePayment, MakePaymentBySavedCreditCard } from "../payment-gateway.interface";
import { CieloRepository } from "./cielo.repository"

describe('Cielo repository', () => {

    let cielo: CieloMock;
    let paymentMethodsRepository: PaymentMethodsRepositoryMock;
    let repository: CieloRepository;

    beforeEach(() => {
        cielo = new CieloMock();
        paymentMethodsRepository = new PaymentMethodsRepositoryMock();
        repository = new CieloRepository(cielo as any, paymentMethodsRepository as any);

        cielo._createCreditCardTransactionResponse = Promise.resolve({
            payment: {
                creditCard: {cardNumber: "1234"},
                paymentId: "anyPaymentId",
                tid: "anyTransactionId"
            }
        });
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

    describe('given find credit cards', () => {

        const cards = [{id: "anyCardId1"}, {id: "anyCardId2"}];

        it('then return credit cards found', async () => {
            paymentMethodsRepository._findByUserResponse = cards;

            const response = await repository.findCreditCards({
                email: "any@email.com", userId: "anyUserId"
            });

            expect(response).toEqual(cards);
        })

    })

    describe('given find credit card by id', () => {

        const card = {
            brand: "anyBrand",
            exp_month: 10,
            exp_year: 2090,
            last4: "anyLast4"
        };

        it('then return credit card', async () => {
            paymentMethodsRepository._findByIdAndUserResponse = Promise.resolve({
                creditCard: card
            });

            const response = await repository.findCreditCardById({
                id: "anyCardId", userId: "anyUserId"
            });

            expect(response).toEqual({...card, id: "anyCardId"});
        })

    })

    describe('given remove credit card by id', () => {

        it('then remove credit card', async () => {
            await repository.deleteCreditCard("anyCardId");

            expect(paymentMethodsRepository._isDeleted).toBeTruthy();
        })

    })

    describe('given pay by saved credit card', () => {

        let payment: MakePaymentBySavedCreditCard;

        beforeEach(() => {
            payment = {
                id: "anyCreditCardId",
                purchaseId: "anyPurchaseId",
                totalPrice: 15,
                user: {
                    email: "testing@email.com",
                    id: "anyUserId"
                }
            };

            paymentMethodsRepository._findByIdAndUserResponse = {
                billingAddress: {},
                creditCard: {
                    brand: "anyBrand",
                    exp_month: 10,
                    exp_year: 2023,
                    id: "anyCreditCardId",
                    last4: "1234"
                },
                user: {email: "anyUserEmail"}
            };
        })

        it('when success, then return payment data', async () => {
            const response = await repository.payBySavedCreditCard(payment);

            expect(response).toEqual({
                cardDetails: {
                    brand: "anyBrand",
                    exp_month: 10,
                    exp_year: 2023,
                    id: "anyCreditCardId",
                    last4: "1234"
                },
                id: "anyPaymentId",
                receiptUrl: "",
                status: "success"
            });
        })

        it('when credit card not found, then throw internal server error exception', async () => {
            paymentMethodsRepository._findByIdAndUserResponse = null;

            await expect(repository.payBySavedCreditCard(payment))
                .rejects.toThrowError(InternalServerErrorException);
        })

        describe('when error on create card transaction', () => {

            beforeEach(() => {
                cielo._createCreditCardTransactionResponse = Promise.reject({response: {message: 'error'}});
            })

            it('then throw bad request exception', async () => {
                await expect(repository.payBySavedCreditCard(payment))
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
    _findByIdAndUserResponse;
    _findByUserResponse;
    _isDeleted = false;
    _isSaved = false;

    deleteById() {
        this._isDeleted = true;
    }
    findByIdAndUser() {
        return this._findByIdAndUserResponse;
    }
    findByUser() {
        return this._findByUserResponse;
    }
    savePaymentDetails() {
        this._isSaved = true;
        return "anyPaymentDetailsId";
    }
}