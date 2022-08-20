import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class PurchaseRepository {

    updatePaymentByPix(params: UpdateParams) {
        return admin.firestore()
            .collection('purchases')
            .doc(params.purchaseId)
            .update({
                'payment.receiptUrl': params.receiptUrl,
                status: "VERIFYING_PAYMENT"
            })
    }

}

type UpdateParams = {
    purchaseId: string;
    receiptUrl: string;
}