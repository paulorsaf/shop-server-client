import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class StockRepository {

    findByIdAndProduct(id: string, productId: string): Promise<StockDb> {
        return admin.firestore()
            .collection('stocks')
            .doc(id)
            .get()
            .then(snapshot => {
                if (!snapshot.exists) {
                    return null;
                }
                const stock = snapshot.data();
                const stockDb = <StockDb> {
                    color: stock.color,
                    productId: stock.productId,
                    quantity: stock.quantity,
                    size: stock.size
                }

                if (stockDb.productId !== productId) {
                    return null;
                }
                return stockDb;
            })
    }

}

type StockDb = {
    productId: string;
    quantity: number;
    size: string;
    color: string;
}