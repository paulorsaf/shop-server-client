import * as admin from 'firebase-admin';
import { PaymentDB } from '../../../../../db/payment.db';
import { FindCreditCardsResponse } from '../payment-gateway.interface';

export class PaymentMethodsRepository {

    deleteById(id: string) {
        return admin.firestore()
            .collection('payments')
            .doc(id)
            .update({isRemoved: true});
    }

    findByIdAndUser(params: FindByIdAndUser): Promise<PaymentDB> {
        return admin.firestore()
            .collection('payments')
            .doc(params.id)
            .get()
            .then(snapshot => {
                if (!snapshot.exists) {
                    return null;
                }
                const data = snapshot.data() as PaymentDB;
                if (data.user?.id === params.userId) {
                    return data;
                }
                return null;
            })
    }

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

    savePaymentDetails(params: PaymentDB): Promise<string> {
        return admin.firestore()
            .collection('payments')
            .add(JSON.parse(JSON.stringify(params)))
            .then(snapshot => snapshot.id);
    }

}

type FindByIdAndUser = {
    id: string;
    userId: string;
}