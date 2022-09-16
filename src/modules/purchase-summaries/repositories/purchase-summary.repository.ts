import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { DailyPurchasesSummary, PurchaseSummary } from '../models/daily-purchases-summary.model';

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

    updatePaymentError(update: UpdatePaymentError) {
        return admin.firestore()
            .collection('purchase-summaries')
            .doc(update.dailyPurchaseId)
            .update({
                [`purchases.${update.purchaseId}.payment.error`]: update.error?.toString() || ""
            })
    }

}

type FindByCompanyIdAndDate = {
    companyId: string,
    date: string
}

type UpdatePaymentError = {
    dailyPurchaseId: string;
    purchaseId: string;
    error: any;
}