import { Injectable } from "@nestjs/common";
import { Category } from "../entity/category";
import * as admin from 'firebase-admin';
import { CategoryDb } from "../../../db/category.db";

@Injectable()
export class CategoryRepository {

    findByCompany(companyId: string) : Promise<Category[]> {
        return admin.firestore()
            .collection('categories')
            .where('companyId', '==', companyId)
            .orderBy('name', 'asc')
            .get()
            .then(snapshot =>
                snapshot.docs
                    .filter(d => {
                        const category = d.data() as CategoryDb;
                        return category.isVisible === undefined ? true : category.isVisible;
                    })
                    .map(d => {
                        const category = d.data() as Category;
                        return new Category(d.id, category.name);
                    })
            );
    }

}