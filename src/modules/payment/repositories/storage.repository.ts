import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import * as admin from 'firebase-admin';

@Injectable()
export class StorageRepository {

    saveFile(image: SavePaymentReceipt) {
        return admin.storage().bucket().upload(image.receipt, {
            destination: this.getFileDestination(image)
        }).then(imageData => {
            return imageData[0].getSignedUrl({
                action: 'read', expires: '12-12-2999'
            }).then(response => response[0])
        })
    }

    private getFileDestination(image: SavePaymentReceipt) {
        const fileType = image.receipt.substring(image.receipt.lastIndexOf('.')+1);
        return `receipts/pix/${image.companyId}/${image.purchaseId}/${randomUUID()}.${fileType}`
    }

}

type SavePaymentReceipt = {
    companyId: string;
    purchaseId: string;
    receipt: string;
}