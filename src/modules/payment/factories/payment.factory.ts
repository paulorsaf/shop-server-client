import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';
import { PaymentGateway } from '../repositories/payment-gateway/payment-gateway.interface';
import { StripeRepository } from '../repositories/payment-gateway/stripe.repository';

@Injectable()
export class PaymentFactory {

    createPayment(companyId: string): PaymentGateway {
        const env = dotenv.config();

        const stripeKey = env.parsed[`_${companyId.toUpperCase()}_PAYMENT_KEY`];
        const apiVersion = '2022-08-01'
        const stripe = new Stripe(stripeKey, {apiVersion});
        
        return new StripeRepository(stripe);
    }

}