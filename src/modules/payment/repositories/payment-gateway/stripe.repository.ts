import Stripe from 'stripe';
import { InternalServerErrorException } from '@nestjs/common';
import { FindCreditCards, FindCreditCardsResponse, MakePayment, PayByCreditCardResponse, PaymentGateway } from './payment-gateway.interface';

export class StripeRepository implements PaymentGateway {

    readonly stripe: Stripe;

    constructor(stripe: Stripe) {
        this.stripe = stripe;
    }

    async findCreditCards(find: FindCreditCards): Promise<FindCreditCardsResponse[]> {
        const customer = await this.findCustomer(find.email);
        if (!customer) {
            return [];
        }

        const creditCards = await this.findCustomerCreditCards(customer);

        return creditCards.data
            .filter(d => d.card)
            .map(d => ({
                brand: d.card.brand,
                exp_month: d.card.exp_month,
                exp_year: d.card.exp_year,
                id: d.id,
                last4: d.card.last4
            }));
    }

    async payByCreditCard(payment: MakePayment): Promise<PayByCreditCardResponse> {
        try {
            const customer = await this.findOrCreateCustomer(payment.user.email);
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

    private async findCustomerCreditCards(customer: Stripe.Customer): Promise<Stripe.ApiList<Stripe.PaymentMethod>> {
        const creditCards = await this.stripe.paymentMethods.list({
            type: 'card',
            customer: customer.id
        })
        if (!creditCards?.data?.length) {
            return {data: []} as any;
        }
        return creditCards;
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

    private async findOrCreateCustomer(email: string) {
        let customer = await this.findCustomer(email);
        if (!customer) {
            return this.createCustomer(email);
        }
        return customer;
    }

    private async findCustomer(email: string) {
        const customers = await this.stripe.customers.search({
            query: `email:\'${email}\'`, limit: 1
        });

        return customers?.data?.length ? customers.data[0] : null;;
    }

    private async createCustomer(email: string) {
        return await this.stripe.customers.create({
            email: email
        })
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