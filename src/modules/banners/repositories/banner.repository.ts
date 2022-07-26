import { Injectable } from "@nestjs/common";
import * as admin from 'firebase-admin';
import { Banner } from "../entities/banner";

@Injectable()
export class BannerRepository {

    findByCompany(companyId: string) : Promise<Banner[]> {
        return admin.firestore()
            .collection('banners')
            .where('companyId', '==', companyId)
            .get()
            .then(snapshot =>
                snapshot.docs.map(d => {
                    const banner = <Banner> d.data();
                    return new Banner(d.id, banner.productId);
                })
            );
    }

}