import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import * as admin from 'firebase-admin';
import { CreatePurchaseProductStock } from '../model/create-purchase-product-stock.model';
import { CreatePurchaseProduct } from '../model/create-purchase-product.model';
import { CreatePurchase } from '../model/create-purchase.model';

@Injectable()
export class PurchaseRepository {

    findAllByUserAndCompany(query: FindAllQuery) {
        return admin.firestore()
            .collection('purchases')
            .where("companyId", "==", query.companyId)
            .where("user.id", "==", query.userId)
            .orderBy("createdAt", "desc")
            .get()
            .then(snapshot => {
                return snapshot.docs.map(d => {
                    const data = d.data();

                    return new CreatePurchase({
                        companyId: data.companyId,
                        id: d.id,
                        address: data.address,
                        createdAt: data.createdAt,
                        payment: data.payment,
                        products: data.products.map(p => 
                            new CreatePurchaseProduct({
                                companyId: p.companyId,
                                id: p.id,
                                stock: p.stock ? new CreatePurchaseProductStock({
                                    companyId: p.stock.companyId,
                                    id: p.stock.id,
                                    productId: p.stock.productId,
                                    color: p.stock.color,
                                    quantity: p.stock.quantity,
                                    size: p.stock.size
                                }) : null,
                                amount: p.amount,
                                name: p.name
                            })
                        ),
                        status: data.status,
                        user: {
                            email: data.user.email,
                            id: data.user.id
                        }
                    })
                })
            })
    }

    create(purchase: CreatePurchase) {
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