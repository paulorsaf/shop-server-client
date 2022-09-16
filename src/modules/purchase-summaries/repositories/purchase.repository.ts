import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Purchase } from '../models/purchase.model';

@Injectable()
export class PurchaseRepository {

    findByIdAndCompanyId({companyId, id}: FindByCompanyAndUser): Promise<Purchase> {
        return admin.firestore()
            .collection('purchases')
            .doc(id)
            .get()
            .then(snapshot => {
                if (!snapshot.exists) {
                    return null;
                }
                const db = snapshot.data();
                if (db.companyId !== companyId) {
                    return null;
                }
                return this.createPurchaseModel(snapshot.id, db);
            })
    }

    private createPurchaseModel(id: string, data: admin.firestore.DocumentData) {
        return new Purchase({
            companyId: data.companyId,
            id: id,
            address: data.address,
            createdAt: data.createdAt,
            payment: data.payment,
            price: data.price,
            products: data.products.map(p => ({
                id: p.id,
                amount: p.amount,
                name: p.name,
                price: p.price,
                priceWithDiscount: p.priceWithDiscount
            })
            ),
            status: data.status,
            user: {
                email: data.user.email,
                id: data.user.id
            }
        })
    }

}

type FindByCompanyAndUser = {
    companyId: string;
    id: string;
}