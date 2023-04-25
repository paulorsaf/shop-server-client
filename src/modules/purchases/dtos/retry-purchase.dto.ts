export type RetryPurchaseDTO = {
    payment: RetryPaymentDTO;
}

export type RetryPaymentDTO = {
    changeFor?: number;
    receipt?: string;
    type: string;
}