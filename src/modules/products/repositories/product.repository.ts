import { Injectable } from "@nestjs/common";
import * as admin from 'firebase-admin';
import { Product, ProductImage } from "../entity/product";

@Injectable()
export class ProductRepository {

    findById(productId: string) : Promise<Product> {
        return admin.firestore()
            .collection('products')
            .doc(productId)
            .get()
            .then(snapshot => {
                if (!snapshot.exists) {
                    return null;
                }
                const product = snapshot.data();
                return new Product(
                    product.companyId, product.id, product.name, product.price,
                    product.priceWithDiscount, product.images
                );
            });
    }

}