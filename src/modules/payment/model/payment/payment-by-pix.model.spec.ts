import { PaymentByPix } from "./payment-by-pix.model";

describe("Payment > Payment by pix model", () => {

    let payment: PaymentByPix;
    let storageRepository: StorageRepositoryMock;

    beforeEach(() => {
        storageRepository = new StorageRepositoryMock();

        payment = new PaymentByPix({
            receipt: "anyReceipt",
            storageRepository: storageRepository as any
        });
    })

    it('given save receipt, then store receipt', async () => {
        storageRepository._response = Promise.resolve("anyReceiptUrl");
        
        await payment.saveReceipt({
            companyId: "anyCompanyId",
            purchaseId: "anyPurchaseId"
        });

        expect(storageRepository._savedWith).toEqual({
            companyId: "anyCompanyId",
            purchaseId: "anyPurchaseId",
            receipt: "anyReceipt"
        });
    })

    it('given receipt saved, then update receipt url property', async () => {
        storageRepository._response = Promise.resolve("anyReceiptUrl");

        await payment.saveReceipt({
            companyId: "anyCompanyId",
            purchaseId: "anyPurchaseId"
        });

        expect(payment.receiptUrl).toEqual("anyReceiptUrl");
    })

})

class StorageRepositoryMock {
    _savedWith;
    _response;

    saveFile(params) {
        this._savedWith = params;
        return this._response;
    }
}