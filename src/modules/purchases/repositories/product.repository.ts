import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { Product } from '../model/product.model';

@Injectable()
export class ProductRepository {

    findById(productId: string) {
        return admin.firestore()
            .collection('products')
            .doc(productId)
            .get()
            .then(snapshot => {
                if (!snapshot.exists){
                    return null;
                }
                return <ProductDb> snapshot.data();
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