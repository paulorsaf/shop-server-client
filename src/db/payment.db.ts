export type PaymentDB = {
    billingAddress: any;
    creditCard: {
        cardToken: string;
        securityCode: string;
        brand: any;
        last4: string;
        exp_month: number;
        exp_year: number;
    };
    gateway: 'CIELO';
    isRemoved: boolean;
    user: {
        email: string;
        id: string;
    }
}