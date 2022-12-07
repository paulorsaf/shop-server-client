export type PurchasePriceResponse = {
    productsPrice: number;
    deliveryPrice: number;
    discount: number;
    paymentFee: number;
    totalPrice: number;
    totalWithPaymentFee: number;
}