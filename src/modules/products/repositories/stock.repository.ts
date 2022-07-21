import { Injectable } from "@nestjs/common";
import * as admin from 'firebase-admin';
import { ProductStock, ProductStockOption } from "../entity/stock";

@Injectable()
export class StockRepository {

    findByProduct(productId: string) : Promise<ProductStockOption[]> {
        return admin.firestore()
            .collection('stocks')
            .where('productId', '==', productId)
            .get()
            .then(snapshot => {
                if (snapshot.empty) {
                    return null;
                }
                const stock = <ProductStock> snapshot.docs[0].data();
                return stock.stockOptions.map(s => {
                    return new ProductStockOption(
                        s.color, s.id, s.quantity, s.size
                    );
                })
            });
    }

}