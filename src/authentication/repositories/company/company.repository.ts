import { Injectable } from "@nestjs/common";
import * as admin from 'firebase-admin';
import { Company } from "../../../authentication/model/company";

@Injectable()
export class CompanyRepository {

    findById(id: string) : Promise<Company> {
        return admin.firestore()
            .collection('companies')
            .doc(id)
            .get()
            .then(snapshot => {
                if (!snapshot.exists) {
                    return null;
                }
                return <Company> snapshot.data();
            });
    }

}