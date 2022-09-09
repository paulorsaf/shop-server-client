import { InternalServerErrorException } from "@nestjs/common";
import { MakePayment } from "./payment-gateway.interface";
import { StripeRepository } from "./stripe.repository";

describe('Stripe repository', () => {

    let repository: StripeRepository;
    let stripe: StripeMock;

    beforeEach(async () => {
        stripe = new StripeMock();

        repository = new StripeRepository(stripe as any);
    });

    describe('given payment by credit card', () => {

        let payment: MakePayment;

        beforeEach(() => {
            payment = {
                billingAddress: {id: "anyBillingAddress"} as any,
                companyId: "TOQx2rIfbZ5tav2nS2fg",
                creditCard: {
                    cardNumber: "4111 1111 1111 1111",
                    cardCvc: "123",
                    cardFlag: "VISA",
                    cardHolder: "nome teste",
                    cardMonth: "12",
                    cardYear: "2023"
                },
                totalPrice: 15,
                user: {
                    email: "testing@email.com"
                }
            };

            stripe._customerSearchResponse = Promise.resolve({data: [{id: "anyCustomerId"}]});
            stripe._paymentMethodCreateResponse = Promise.resolve({id: "anyPaymentMethodId"});
            stripe._paymentMadeResponse = Promise.resolve({
                id: "anyPaymentIntentId",
                charges: {
                    data: [{
                        receipt_url: "anyReceiptUrl",
                        payment_method_details: {
                            card: {
                                brand: "anyBrand",
                                exp_month: "anyExpMonth",
                                exp_year: "anyExpYear",
                                last4: "1234"
                            }
                        }
                    }]
                },
                status: "anyPaymentIntentStatus"
            });
        })

        it('when success, then return payment data', async () => {
            const response = await repository.payByCreditCard(payment);
    
            expect(response).toEqual({
                cardDetails: {
                    brand: "anyBrand",
                    exp_month: "anyExpMonth",
                    exp_year: "anyExpYear",
                    id: "anyPaymentMethodId",
                    last4: "1234"
                },
                id: "anyPaymentIntentId",
                receiptUrl: "anyReceiptUrl",
                status: "anyPaymentIntentStatus"
            })
        })

        it('when customer found, then do not create new customer', async () => {
            await repository.payByCreditCard(payment);

            expect(stripe._isCustomerCreated).toBeFalsy();
        })

        it('when customer not found, then create new customer', async () => {
            stripe._customerSearchResponse = {data: []};
            stripe._customerCreateResponse = {id: "anyCustomerId"};

            await repository.payByCreditCard(payment);

            expect(stripe._isCustomerCreated).toBeTruthy();
        })

        it('when search customer failed, then return internal server error', async () => {
            stripe._customerSearchResponse = Promise.reject("anyError");

            await expect(repository.payByCreditCard(payment))
                .rejects.toThrowError(InternalServerErrorException);
        })

        it('when customer found, then create payment method', async () => {
            await repository.payByCreditCard(payment);

            expect(stripe._isPaymentMethodCreated).toBeTruthy();
        })

        it('when create payment method failed, then return internal server error', async () => {
            stripe._paymentMethodCreateResponse = Promise.reject("anyError");

            await expect(repository.payByCreditCard(payment))
                .rejects.toThrowError(InternalServerErrorException);
        })

        it('when payment method created, then attach payment method to customer', async () => {
            await repository.payByCreditCard(payment);

            expect(stripe._isPaymentMethodAttached).toBeTruthy();
        })

        it('when payment method created, then make payment', async () => {
            await repository.payByCreditCard(payment);

            expect(stripe._isPaymentMade).toBeTruthy();
        })

        it('when payment failed, then return internal server error', async () => {
            stripe._paymentMadeResponse = Promise.reject("anyError");

            await expect(repository.payByCreditCard(payment))
                .rejects.toThrowError(InternalServerErrorException);
        })

    })

})

class StripeMock {

    _customerCreateResponse;
    _customerSearchResponse;
    _paymentMadeResponse;
    _paymentMethodCreateResponse;

    _isCustomerCreated = false;
    _isPaymentMade = false;
    _isPaymentMethodAttached = false;
    _isPaymentMethodCreated = false;

    paymentIntents = {
        create: () => {
            this._isPaymentMade = true;
            return this._paymentMadeResponse;
        }
    }
    customers = {
        create: () => {
            this._isCustomerCreated = true;
            return this._customerCreateResponse;
        },
        search: () => this._customerSearchResponse
    }
    paymentMethods = {
        attach: () => this._isPaymentMethodAttached = true,
        create: () => {
            this._isPaymentMethodCreated = true;
            return this._paymentMethodCreateResponse;
        }
    }

}