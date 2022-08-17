import { Injectable } from "@nestjs/common";
import * as admin from 'firebase-admin';
import { ProductStock } from "../entity/stock";

@Injectable()
export class StockRepository {

    findByProduct(productId: string) : Promise<ProductStock[]> {
        return admin.firestore()
            .collection('stocks')
            .where('productId', '==', productId)
            .get()
            .then(snapshot => {
                if (snapshot.empty) {
                    return null;
                }
                return snapshot.docs.map(p => {
                    const product = p.data();
                    return <ProductStock> new ProductStock(
                        product.color, p.id, product.quantity, product.size
                    );
                })
            });
    }

}