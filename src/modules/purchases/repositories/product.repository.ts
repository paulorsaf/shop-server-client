import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { CreatePurchaseProductStock } from '../model/create-purchase-product-stock.model';
import { CreatePurchaseProduct } from '../model/create-purchase-product.model';

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
                return new CreatePurchaseProduct({
                    companyId: db.companyId,
                    name: db.name,
                    id: snapshot.id,
                    stock: await this.findStock(productId, stockId)
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

                return new CreatePurchaseProductStock({
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
}

type StockDb = {
    color: string;
    companyId: string;
    productId: string;
    quantity: number;
    size: string;
}