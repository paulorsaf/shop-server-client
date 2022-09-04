import * as admin from 'firebase-admin';
import { Injectable } from "@nestjs/common";
import { LatLng } from "../model/lag-lnt.model";
import { Purchase } from "../model/purchase.model";

@Injectable()
export class PurchaseRepository {

    findByIdAndCompanyId({companyId, purchaseId}: FindByCompanyAndId): Promise<Purchase> {
        return admin.firestore()
            .collection('purchases')
            .doc(purchaseId)
            .get()
            .then(snapshot => {
                if (!snapshot.exists) {
                    return null;
                }
                const db = snapshot.data();
                if (db.companyId !== companyId) {
                    return null;
                }
                return {
                    address: db.address,
                    id: snapshot.id
                };
            });
    }

    updateGeolocation(param: UpdateGeolocation) {
        return admin.firestore()
            .collection('purchases')
            .doc(param.purchaseId)
            .update({
                'address.latitude': param.latLng.latitude,
                'address.longitude': param.latLng.longitude
            })
    }

}

type FindByCompanyAndId = {
    companyId: string;
    purchaseId: string;
}

type UpdateGeolocation = {
    purchaseId: string;
    latLng: LatLng;
}