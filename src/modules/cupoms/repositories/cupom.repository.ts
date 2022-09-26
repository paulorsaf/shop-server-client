import * as admin from 'firebase-admin';
import { Injectable } from "@nestjs/common";
import { Cupom } from '../models/cupom.model';

@Injectable()
export class CupomRepository {

    decreaseAmountLeftById(id: string) {
        return admin.firestore()
            .collection('cupoms')
            .doc(id)
            .update({
                amountLeft: admin.firestore.FieldValue.increment(-1)
            })
    }

    find(find: Find): Promise<Cupom> {
        return admin.firestore()
            .collection('cupoms')
            .where('companyId', '==', find.companyId)
            .where('cupom', '==', find.cupom)
            .get()
            .then(snapshot => {
                if (snapshot.empty) {
                    return null;
                }
                const doc = snapshot.docs[0];
                const db = doc.data();
                return {
                    amountLeft: db.amountLeft,
                    cupom: db.cupom,
                    discount: db.discount,
                    expireDate: db.expireDate,
                    id: doc.id
                }
            })
    }

}

type Find = {
    readonly companyId: string;
    readonly cupom: string;
}