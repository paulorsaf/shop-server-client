import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Payment } from '../model/payment.model';
import { Purchase } from '../model/purchase.model';
import { PayByCreditCardResponse } from './payment-gateway/payment-gateway.interface';

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
                    price: purchase.price,
                    user: {
                        email: purchase.user.email,
                        id: purchase.user.id
                    }
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

    updatePaymentByCreditCard(update: UpdatePaymentByCreditCard) {
        return admin.firestore()
            .collection('purchases')
            .doc(update.purchaseId)
            .update({
                'payment.receiptUrl': update.paymentDetails.receiptUrl,
                'payment.card': update.paymentDetails.cardDetails,
                'payment.id': update.paymentDetails.id,
                'payment.status': update.paymentDetails.status,
                status: "PAID"
            })
    }

    updatePaymentError(purchase: Purchase) {
        return admin.firestore()
            .collection('purchases')
            .doc(purchase.id)
            .update({
                'payment.error': JSON.parse(JSON.stringify(purchase.payment.error))
            });
    }

}

type UpdateParams = {
    purchaseId: string;
    receiptUrl: string;
}

type UpdatePaymentByCreditCard = {
    purchaseId: string;
    paymentDetails: PayByCreditCardResponse;
}