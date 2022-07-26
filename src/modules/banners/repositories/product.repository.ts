import { Injectable } from "@nestjs/common";
import * as admin from 'firebase-admin';
import { Product } from "../entities/product";

@Injectable()
export class ProductRepository {

    findById(productId: string) : Promise<Product> {
        return admin.firestore()
            .collection('products')
            .doc(productId)
            .get()
            .then(snapshot => {
                if (snapshot.exists) {
                    const product = <Product> snapshot.data();
                    return new Product(
                        product.id,
                        product.images,
                        product.name,
                        product.price,
                        product.priceWithDiscount
                    )
                }
                return null;
            });
    }

}