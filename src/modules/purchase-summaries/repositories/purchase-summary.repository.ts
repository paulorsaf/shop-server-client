import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { DailyPurchasesSummary, PurchaseSummary } from '../models/daily-purchases-summary.model';
import { Purchase } from '../models/purchase.model';

@Injectable()
export class PurchaseSummaryRepository {

    add(id: string, purchaseSummary: PurchaseSummary) {
        return admin.firestore()
            .collection('purchase-summaries')
            .doc(id)
            .update({
                [`purchases.${purchaseSummary.id}`]: JSON.parse(JSON.stringify(purchaseSummary))
            })
    }

    create(summary: DailyPurchasesSummary) {
        return admin.firestore()
            .collection('purchase-summaries')
            .add(JSON.parse(JSON.stringify(summary)));
    }

    findByCompanyIdAndDate({companyId, date}: FindByCompanyIdAndDate): Promise<DailyPurchasesSummary> {
        return admin.firestore()
            .collection('purchase-summaries')
            .where('companyId', '==', companyId)
            .where('date', '==', date)
            .get()
            .then(snapshot => {
                if (snapshot.empty) {
                    return null;
                }
                const db = snapshot.docs[0];
                return <DailyPurchasesSummary> {
                    ...snapshot.docs[0].data(),
                    id: db.id
                };
            })
    }

    updateLocation({dailyPurchaseId, purchase, location}: UpdatePurchaseLocation) {
        return admin.firestore()
            .collection('purchase-summaries')
            .doc(dailyPurchaseId)
            .update({
                [`purchases.${purchase.id}.address`]: location
            })
    }

    updatePaymentError({dailyPurchaseId, purchase, error}: UpdatePurchaseError) {
        return admin.firestore()
            .collection('purchase-summaries')
            .doc(dailyPurchaseId)
            .update({
                [`purchases.${purchase.id}.payment.error`]: error?.toString() || "",
                [`purchases.${purchase.id}.status`]: purchase.status
            })
    }

    updatePaymentSuccess({dailyPurchaseId, purchase}: UpdatePurchase) {
        return admin.firestore()
            .collection('purchase-summaries')
            .doc(dailyPurchaseId)
            .update({
                [`purchases.${purchase.id}.payment.error`]: "",
                [`purchases.${purchase.id}.payment.receiptUrl`]: purchase.payment.receiptUrl,
                [`purchases.${purchase.id}.payment.type`]: purchase.payment.type,
                [`purchases.${purchase.id}.status`]: purchase.status
            })
    }

}

type FindByCompanyIdAndDate = {
    companyId: string,
    date: string
}

type UpdatePurchase = {
    dailyPurchaseId: string;
    purchase: Purchase
}

type UpdatePurchaseError = {
    error: any
} & UpdatePurchase;

type UpdatePurchaseLocation = {
    location: {latitude: number, longitude: number}
} & UpdatePurchase;