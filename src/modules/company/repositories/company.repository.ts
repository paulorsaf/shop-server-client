import * as admin from 'firebase-admin';
import { Injectable } from "@nestjs/common";
import { Company } from '../model/company.model';

@Injectable()
export class CompanyRepository {

    findById(id: string) {
        return admin.firestore()
            .collection("companies")
            .doc(id)
            .get()
            .then(snapshot => {
                if (!snapshot.exists) {
                    return null;
                }
                const db = snapshot.data();
                return new Company({
                    aboutUs: db.aboutUs,
                    address: db.address,
                    id: db.id,
                    name: db.name,
                    payment: db.payment
                })
            })
    }

}