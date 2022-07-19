import { Injectable } from "@nestjs/common";
import { Category } from "../entity/category";
import * as admin from 'firebase-admin';

@Injectable()
export class CategoryRepository {

    findByCompany(companyId: string) : Promise<Category[]> {
        return admin.firestore()
            .collection('categories')
            .where('companyId', '==', companyId)
            .orderBy('name', 'asc')
            .get()
            .then(snapshot =>
                snapshot.docs.map(d => {
                    const category = d.data();
                    return new Category(d.id, category.name);
                })
            );
    }

}