import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Payment } from '../model/payment.model';
import { Purchase } from '../model/purchase.model';

@Injectable()
export class PurchaseRepository {

    findByIdAndCompany({purchaseId, companyId}: {purchaseId: string, companyId: string}) {
        return admin.firestore()
            .collection('purchases')
            .doc(purchaseId)
            .get()
            .then(snapshot => {
                if (!snapshot.exists){
                    return null;
                }
                const purchase = snapshot.data();
                if (purchase.companyId !== companyId) {
                    return null;
                }
                return new Purchase({
                    companyId: purchase.companyId,
                    id: snapshot.id,
                    payment: purchase.payment ?
                        new Payment({
                            type: purchase.payment.type
                        })
                        : null,
                    userId: purchase.userId
                })
            })
    }

    updatePaymentByPix(purchase: Purchase) {
        return admin.firestore()
            .collection('purchases')
            .doc(purchase.id)
            .update({
                'payment.receiptUrl': purchase.payment.receiptUrl,
                status: "VERIFYING_PAYMENT"
            })
    }

    updatePaymentError(purchase: Purchase) {
        return admin.firestore()
            .collection('purchases')
            .doc(purchase.id)
            .update({
                'payment.error': purchase.payment.error
            });
    }

}

type UpdateParams = {
    purchaseId: string;
    receiptUrl: string;
}