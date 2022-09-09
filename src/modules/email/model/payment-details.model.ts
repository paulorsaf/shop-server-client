export type PaymentDetails = {
    cardDetails: {
        brand: string;
        exp_month: number;
        exp_year: number;
        id: string;
        last4: string;
    };
    id: string;
    receiptUrl: string;
    status: string;
}