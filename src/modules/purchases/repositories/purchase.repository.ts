import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import * as admin from 'firebase-admin';
import { Purchase } from '../model/purchase.model';

@Injectable()
export class PurchaseRepository {

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