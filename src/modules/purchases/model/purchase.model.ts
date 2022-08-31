import { PurchaseProduct } from "./purchase-product.model";

export class Purchase {

    readonly id: string;
    readonly companyId: string;

    readonly address: any;
    readonly createdAt: string;
    readonly payment: Payment;
    readonly products: PurchaseProduct[];
    readonly status: string;
    readonly user: User;

    readonly totalAmount: number;
    readonly totalPrice: number;

    constructor(param: PurchaseParam) {
        this.id = param.id;
        this.companyId = param.companyId;

        this.address = param.address;
        this.createdAt = param.createdAt;
        this.payment = param.payment
        this.products = param.products;
        this.status = param.status;
        this.user = param.user;

        this.totalAmount = this.calculateTotalAmount();
        this.totalPrice = this.calculateTotalPrice();
    }

    private calculateTotalAmount() {
        let total = 0;
        if (this.products) {
            this.products.forEach(p => total += p.amount);
        }
        return total;
    }

    private calculateTotalPrice() {
        let total = 0;
        if (this.products) {
            this.products.forEach(p => total += p.totalPrice);
        }
        return total;
    }

}

type PurchaseParam = {
    id?: string;
    companyId: string;

    address?: Address;
    createdAt?: string;
    payment?: Payment;
    products?: PurchaseProduct[];
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
    latitude: number;
    longitude: number;
}

type Payment = {
    error?: any;
    receiptUrl?: string;
    type: string;
}