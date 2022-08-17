import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class StockRepository {

  descreaseQuantityBy({id, decreaseBy}: {id: string, decreaseBy: number}) {
      return admin.firestore()
          .collection('stocks')
          .doc(id)
          .update({
              quantity: admin.firestore.FieldValue.increment(-decreaseBy)
          }).then(() => -decreaseBy);
  }

}