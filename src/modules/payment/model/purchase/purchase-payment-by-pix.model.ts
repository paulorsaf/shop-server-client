import { PurchaseRepository } from "../../repositories/purchase.repository";
import { PaymentByPix } from "../payment/payment-by-pix.model";

export class PurchasePaymentByPix {

    readonly companyId: string;
    readonly payment: PaymentByPix;
    readonly purchaseId: string;
    readonly userId: string;

    #purchaseRepository: PurchaseRepository;
    
    constructor(params: PurchaseParams){
        this.companyId = params.companyId;
        this.payment = params.payment;
        this.purchaseId = params.purchaseId;
        this.userId = params.userId;
        this.#purchaseRepository = params.purchaseRepository || new PurchaseRepository();
    }

    savePayment() {
        return this.payment.saveReceipt({
            companyId: this.companyId,
            purchaseId: this.purchaseId
        })
    }

}

type PurchaseParams = {
    companyId: string;
    payment: PaymentByPix;
    purchaseId: string;
    userId: string;
    purchaseRepository?: PurchaseRepository;
}