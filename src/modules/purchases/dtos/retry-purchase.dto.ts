export type RetryPurchaseDTO = {
    payment: RetryPaymentDTO;
}

export type RetryPaymentDTO = {
    receipt?: string;
    type: string;
}