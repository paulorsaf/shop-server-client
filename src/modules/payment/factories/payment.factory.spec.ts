import { Test, TestingModule } from "@nestjs/testing";
import { StripeRepository } from "../repositories/payment-gateway/stripe.repository";
import { PaymentFactory } from "./payment.factory";

describe('Payment factory', () => {

    let factory: PaymentFactory;
    let stripeRepository = {id: "STRIPE REPOSITORY"};

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PaymentFactory
            ]
        })
        .compile();
    
        factory = module.get<PaymentFactory>(PaymentFactory);
    });

    it('given company payment is stripe, then return stripe factory', () => {
        const response = factory.createPayment('anyCompanyId');

        expect(response).toBeInstanceOf(StripeRepository);
    })

})