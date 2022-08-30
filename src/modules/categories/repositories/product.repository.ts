import { Injectable } from "@nestjs/common";
import * as admin from 'firebase-admin';
import { Product, ProductImage } from "../entity/product";

@Injectable()
export class ProductRepository {

    findByCompanyAndCategory(companyId: string, categoryId: string) : Promise<Product[]> {
        return admin.firestore()
            .collection('products')
            .where('companyId', '==', companyId)
            .where('categoryId', '==', categoryId)
            .where('totalStock', '>', 0)
            .orderBy('totalStock', 'asc')
            .orderBy('name', 'asc')
            .get()
            .then(snapshot =>
                snapshot.docs.map(d => {
                    const product = d.data();
                    return new Product(
                        d.id, product.name, product.price, product.priceWithDiscount,
                        product.images
                    );
                })
            );
    }

}