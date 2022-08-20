import { PurchasePaymentByPix } from "./purchase-payment-by-pix.model";

describe("Payment > Purchase payment by pix model", () => {

    let purchasePayment: PurchasePaymentByPix;

    let paymentByPixMock: PaymentByPixMock;
    let purchaseRepositoryMock: PurchaseRepositoryMock;

    beforeEach(() => {
        paymentByPixMock = new PaymentByPixMock();
        purchaseRepositoryMock = new PurchaseRepositoryMock();

        purchasePayment = new PurchasePaymentByPix({
            companyId: "anyCompanyId",
            payment: paymentByPixMock as any,
            purchaseId: "anyPurchaseId",
            userId: "anyUserId",
            purchaseRepository: purchaseRepositoryMock as any
        })
    })

    it('given save payment, then save pix receipt', async () => {
        paymentByPixMock._response = Promise.resolve();

        await purchasePayment.savePayment();
        
        expect(paymentByPixMock._isSaved).toBeTruthy();
    })

    it('given pix receipt saved, then update purchase', async () => {
        paymentByPixMock._response = Promise.resolve();

        await purchasePayment.savePayment();

        expect(purchaseRepositoryMock._isUpdated).toBeTruthy();
    })

})

class PaymentByPixMock {
    _isSaved = false;
    _response;

    saveReceipt() {
        this._isSaved = true;
        return this._response;
    }
}

class PurchaseRepositoryMock {
    _isUpdated = false;
    updatePaymentByPix() {
        this._isUpdated = true;
    }
}