import * as admin from 'firebase-admin';
import { FindCreditCardsResponse } from '../payment-gateway.interface';

export class PaymentMethodsRepository {

    findByUser(userId: string): Promise<FindCreditCardsResponse[]> {
        return admin.firestore()
            .collection('payments')
            .where('user.id', '==', userId)
            .where('isRemoved', '==', false)
            .get()
            .then(snapshot => {
                if (snapshot.empty) {
                    return [];
                }
                return snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        brand: data.creditCard.brand,
                        exp_month: data.creditCard.exp_month,
                        exp_year: data.creditCard.exp_year,
                        id: doc.id,
                        last4: data.creditCard.last4
                    }
                });
            })
    }

    savePaymentDetails(params: PaymentDetails): Promise<string> {
        return admin.firestore()
            .collection('payments')
            .add(JSON.parse(JSON.stringify(params)))
            .then(snapshot => snapshot.id);
    }

}

type PaymentDetails = {
    billingAddress: any;
    creditCard: {
        cardToken: string;
        securityCode: string;
        brand: any;
        last4: string;
        exp_month: number;
        exp_year: number;
    };
    gateway: 'CIELO';
    isRemoved: boolean;
    user: {
        email: string;
        id: string;
    }
}