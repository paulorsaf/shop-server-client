import Stripe from 'stripe';
import { InternalServerErrorException } from '@nestjs/common';
import { MakePayment, PayByCreditCardResponse, PaymentGateway } from './payment-gateway.interface';

export class StripeRepository implements PaymentGateway {

    readonly stripe: Stripe;

    constructor(stripe: Stripe) {
        this.stripe = stripe;
    }

    async payByCreditCard(payment: MakePayment): Promise<PayByCreditCardResponse> {
        try {
            const customer = await this.getCustomer(payment.user.email);
            const paymentMethod = await this.createPaymentMethod(customer, payment);
            const paymentIntent = await this.createPaymentIntent(customer, paymentMethod, payment);

            return Promise.resolve({
                cardDetails: this.createCardDetails(paymentIntent, paymentMethod),
                id: paymentIntent.id,
                receiptUrl: this.getReceiptUrl(paymentIntent),
                status: paymentIntent.status
            });
        } catch (error) {
            throw new InternalServerErrorException(error.message);
        }
    }

    private createCardDetails(intent: Stripe.PaymentIntent, method: Stripe.PaymentMethod) {
        if (!intent.charges.data?.length) {
            return null;
        }
        return {
            brand: intent.charges.data[0].payment_method_details?.card?.brand,
            exp_month: intent.charges.data[0].payment_method_details?.card?.exp_month,
            exp_year: intent.charges.data[0].payment_method_details?.card?.exp_year,
            id: method.id,
            last4: intent.charges.data[0].payment_method_details?.card?.last4
        };
    }

    private getReceiptUrl(intent: Stripe.PaymentIntent) {
        if (!intent.charges.data?.length) {
            return null;
        }
        return intent.charges.data[0].receipt_url;
    }

    private async getCustomer(email: string) {
        const customers = await this.stripe.customers.search({
            query: `email:\'${email}\'`, limit: 1
        });

        let customer = customers?.data?.length ? customers.data[0] : null;
        if (!customer) {
            customer = await this.stripe.customers.create({
                email: email
            })
        }
        return customer;
    }

    private async createPaymentMethod(customer: Stripe.Customer, payment: MakePayment) {
        const paymentMethod = await this.stripe.paymentMethods.create({
            card: {
                exp_month: parseInt(payment.creditCard.cardMonth),
                exp_year: parseInt(payment.creditCard.cardYear),
                number: payment.creditCard.cardNumber,
                cvc: payment.creditCard.cardCvc
            },
            type: 'card'
        });
        this.stripe.paymentMethods.attach(paymentMethod.id, {customer: customer.id});

        return paymentMethod;
    }

    private async createPaymentIntent(customer: Stripe.Customer, method: Stripe.PaymentMethod, payment: MakePayment) {
        const paymentIntent = await this.stripe.paymentIntents.create({
            amount: parseInt((payment.totalPrice * 100).toFixed(0)),
            currency: 'brl',
            customer: customer.id,
            confirm: true,
            capture_method: 'automatic',
            payment_method: method.id
        })
        return paymentIntent
    }

}