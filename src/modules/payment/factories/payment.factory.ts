import Stripe from 'stripe';
import * as dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';
import { PaymentGateway } from '../repositories/payment-gateway/payment-gateway.interface';
import { StripeRepository } from '../repositories/payment-gateway/stripe/stripe.repository';
import { Cielo } from 'cielo';
import { CieloRepository } from '../repositories/payment-gateway/cielo/cielo.repository';

@Injectable()
export class PaymentFactory {

    private env = dotenv.config()

    createPayment(companyId: string): PaymentGateway {
        const paymentType = this.getFromEnv(companyId, 'PAYMENT_TYPE');

        if (paymentType === "CIELO") {
            return this.createCieloPayment(companyId);
        }

        return this.createStripePayment(companyId);
    }

    private createStripePayment(companyId: string) {
        const stripeKey = this.getFromEnv(companyId, 'PAYMENT_KEY');

        const apiVersion = '2022-08-01';
        const stripe = new Stripe(stripeKey, {apiVersion});
        
        return new StripeRepository(stripe);
    }

    private createCieloPayment(companyId: string) {
        const cielo = new Cielo({
            merchantId: this.getFromEnv(companyId, 'MERCHANT_ID'),
            merchantKey: this.getFromEnv(companyId, 'MERCHANT_KEY'),
            sandbox: this.getFromEnv(companyId, 'SANDBOX') ? true : false,
            debug: true
        });

        return new CieloRepository(cielo);
    }

    private getFromEnv(companyId: string, key: string) {
        return process.env[`_${companyId.toUpperCase()}_${key}`] ||
            this.env.parsed[`_${companyId.toUpperCase()}_${key}`];
    }

}