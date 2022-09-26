import { Injectable } from '@nestjs/common';
import { format } from 'date-fns';
import * as admin from 'firebase-admin';
import { PurchaseProductStock } from '../modules/purchases/model/purchase-product-stock.model';
import { PurchaseProduct } from '../modules/purchases/model/purchase-product.model';

@Injectable()
export class CupomRepository {

    findPercentage(find: Find) {
        return admin.firestore()
            .collection('cupoms')
            .where('companyId', '==', find.companyId)
            .where('cupom', '==', find.cupom?.toUpperCase())
            .get()
            .then(async snapshot => {
                if (snapshot.empty){
                    return 0;
                }
                
                const cupom = snapshot.docs[0].data();
                if (cupom.amountLeft === 0) {
                    return 0;
                }
                if (cupom?.expireDate) {
                    const today = format(new Date(), 'yyyy-MM-dd');
                    if (today > cupom.expireDate) {
                        return 0;
                    }
                }
                return cupom.discount;
            })
    }

}

type Find = {
    companyId: string;
    cupom: string;
}