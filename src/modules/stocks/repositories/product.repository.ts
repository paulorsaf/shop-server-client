import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class ProductRepository {

  getTotalStockByProduct(productId: string) {
    return admin.firestore()
      .collection('stocks')
      .where('productId', '==', productId)
      .get()
      .then(snapshot => {
        let total = 0;
        if (snapshot.empty) {
          return total;
        }
        snapshot.docs.map(d => total += d.data().quantity);
        return total;
      })
  }

  update(params: UpdateProductStock) {
    return admin.firestore()
      .collection('products')
      .doc(params.id)
      .update({
        totalStock: params.totalStock
      })
  }

}

type UpdateProductStock = {
  id: string;
  totalStock: number;
}