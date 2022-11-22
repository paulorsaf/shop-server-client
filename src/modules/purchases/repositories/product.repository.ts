import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { PurchaseProductStock } from '../model/purchase-product-stock.model';
import { PurchaseProduct } from '../model/purchase-product.model';

@Injectable()
export class ProductRepository {

    findByIdWithStock(productId: string, stockId: string) {
        return admin.firestore()
            .collection('products')
            .doc(productId)
            .get()
            .then(async snapshot => {
                if (!snapshot.exists){
                    return null;
                }

                const db = <ProductDb> snapshot.data();
                return new PurchaseProduct({
                    companyId: db.companyId,
                    name: db.name,
                    id: snapshot.id,
                    price: db.price,
                    priceWithDiscount: db.priceWithDiscount,
                    productInternalId: db.productInternalId,
                    stock: await this.findStock(productId, stockId),
                    unit: db.unit,
                    weight: db.weight
                });
            })
    }

    private findStock(productId: string, stockId: string) {
        return admin.firestore()
            .collection('stocks')
            .doc(stockId)
            .get()
            .then(snapshot => {
                if (!snapshot.exists){
                    return null;
                }

                const db = <StockDb> snapshot.data();
                if (db.productId !== productId) {
                    return null;
                }

                return new PurchaseProductStock({
                    companyId: db.companyId,
                    id: snapshot.id,
                    productId: db.productId,
                    color: db.color,
                    quantity: db.quantity,
                    size: db.size
                })
            })
    }

}

type ProductDb = {
    companyId: string;
    productId: string;
    description: string;
    name: string;
    price: number;
    priceWithDiscount: number;
    productInternalId: string;
    unit: string;
    weight: number;
}

type StockDb = {
    color: string;
    companyId: string;
    productId: string;
    quantity: number;
    size: string;
}