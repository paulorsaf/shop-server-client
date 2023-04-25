import { PurchasePriceResponse } from "shop-purchase-price";
import { PurchaseProduct } from "./purchase-product.model";

export class Purchase {

    readonly id: string;
    readonly companyId: string;

    readonly address: any;
    readonly createdAt: string;
    readonly payment: Payment;
    readonly products: PurchaseProduct[];
    readonly productNotes: ProductNotes[];
    readonly status: string;
    readonly user: User;
    
    readonly totalAmount: number;

    readonly reason: string;
    private price: Price;

    constructor(param: PurchaseParam) {
        this.id = param.id;
        this.companyId = param.companyId;

        this.address = param.address;
        this.createdAt = param.createdAt;
        this.payment = param.payment
        this.price = param.price;
        this.productNotes = param.productNotes;
        this.products = param.products;
        this.reason = param.reason;
        this.status = param.status;
        this.user = param.user;

        this.totalAmount = this.calculateTotalAmount();
    }

    private calculateTotalAmount() {
        let total = 0;
        if (this.products) {
            this.products.forEach(p => total += p.amount);
        }
        return total;
    }

    setPrice(price: PurchasePriceResponse) {
        this.price = {
            delivery: price.deliveryPrice,
            discount: price.discount,
            paymentFee: this.payment?.type === "CREDIT_CARD" ? price.paymentFee : 0,
            products: price.productsPrice,
            serviceFee: price.serviceFee,
            total: price.totalPrice,
            totalWithPaymentFee: this.payment?.type === "CREDIT_CARD" ?
                price.totalWithPaymentFee : price.totalPrice
        };
    }

}

type PurchaseParam = {
    id?: string;
    companyId: string;

    address?: Address;
    createdAt?: string;
    deliveryPrice?: number;
    payment?: Payment;
    price?: Price;
    productNotes?: ProductNotes[]
    products?: PurchaseProduct[];
    reason?: string;
    status?: string;
    user?: User;
}

type User = {
    email: string;
    id: string;
}

type Address = {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    zipCode: string;
    city: string;
    state: string;
    latitude?: number;
    longitude?: number;
}

type Payment = {
    card?: CreditCard;
    changeFor?: number;
    cupom?: string;
    error?: any;
    id?: string;
    receiptUrl?: string;
    type: string;
}

type CreditCard = {
    brand: string;
    exp_month: number;
    exp_year: number;
    id: string;
    last4: string;
}

type Price = {
    products: number;
    delivery: number;
    discount: number;
    paymentFee: number;
    serviceFee: number;
    total: number;
    totalWithPaymentFee: number;
}

type ProductNotes = {
    notes: string;
    productId: string;
}