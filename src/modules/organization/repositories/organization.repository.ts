import * as admin from 'firebase-admin';
import { Injectable } from "@nestjs/common";
import { Company } from '../model/company.model';
import { CompanyDb } from 'src/db/company.db';

@Injectable()
export class OrganizationRepository {

    findCompaniesByOrganizationId(id: string) {
        return admin.firestore()
            .collection("companies")
            .where('organizationId', '==', id)
            .get()
            .then(snapshot => {
                if (snapshot.empty) {
                    return [];
                }
                return snapshot.docs.map(doc => {
                    const db = <CompanyDb> doc.data();
                    return new Company({
                        aboutUs: db.aboutUs,
                        address: db.address,
                        id: doc.id,
                        logo: db.logo,
                        name: db.name,
                        payment: db.payment
                    })
                });
            })
    }

}