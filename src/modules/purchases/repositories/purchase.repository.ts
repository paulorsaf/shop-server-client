import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import * as admin from 'firebase-admin';
import { Purchase } from '../model/purchase.model';

@Injectable()
export class PurchaseRepository {

    findAll(query: FindAllQuery) {
        return admin.firestore()
            .collection('purchases')
            .where("companyId", "==", query.companyId)
            .where("userId", "==", query.userId)
            // .orderBy("createdAt", "desc")
            .get()
            .then(snapshot => {
                return snapshot.docs.map(d => {
                    const data = d.data();
                    return new Purchase({
                        companyId: data.companyId,
                        userId: data.userId,
                        id: data.id,
                        address: data.address,
                        payment: data.payment,
                        status: data.status,
                        createdAt: data.createdAt
                    })
                })
            })
    }

    save(purchase: Purchase) {
        const purchaseObj = JSON.parse(JSON.stringify(purchase));

        return admin.firestore()
            .collection('purchases')
            .add({
                ...purchaseObj,
                createdAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
                status: "CREATED"
            })
            .then(response => response.id)
    }

}

type FindAllQuery = {
    companyId: string;
    userId: string;
}