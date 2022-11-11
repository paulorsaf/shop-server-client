import { Test, TestingModule } from "@nestjs/testing";
import { CieloRepository } from "../repositories/payment-gateway/cielo/cielo.repository";
import { StripeRepository } from "../repositories/payment-gateway/stripe/stripe.repository";
import { PaymentFactory } from "./payment.factory";

describe('Payment factory', () => {

    let factory: PaymentFactory;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PaymentFactory
            ]
        })
        .compile();
    
        factory = module.get<PaymentFactory>(PaymentFactory);
    });

    it('given company payment not defined, then return stripe repository', () => {
        process.env = {};

        const response = factory.createPayment('anyCompanyId');

        expect(response).toBeInstanceOf(StripeRepository);
    })

    it('given company payment is stripe, then return stripe repository', () => {
        process.env = { _ANYCOMPANYID_PAYMENT_TYPE: 'STRIPE' };

        const response = factory.createPayment('anyCompanyId');

        expect(response).toBeInstanceOf(StripeRepository);
    })

    it('given company payment is cielo, then return cielo repository', () => {
        process.env = { _ANYCOMPANYID_PAYMENT_TYPE: 'CIELO' };

        const response = factory.createPayment('anyCompanyId');

        expect(response).toBeInstanceOf(CieloRepository);
    })

})