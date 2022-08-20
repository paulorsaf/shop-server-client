import { StorageRepository } from "../../repositories/storage.repository";

export class PaymentByPix {

    #receipt: string;
    #storageRepository: StorageRepository;

    receiptUrl: string;

    constructor(params: PaymentParams){
        this.#receipt = params.receipt;
        this.#storageRepository = params.storageRepository || new StorageRepository();
    }

    saveReceipt(params: SaveReceiptParams) {
        return this.#storageRepository.saveFile({
            companyId: params.companyId,
            purchaseId: params.purchaseId,
            receipt: this.#receipt
        }).then(receiptUrl => {
            this.receiptUrl = receiptUrl;
        })
    }

}

type PaymentParams = {
    receipt: string;
    storageRepository?: StorageRepository;
}

type SaveReceiptParams = {
    companyId: string;
    purchaseId: string;
}