import { PurchaseProduct } from "../modules/purchases/entities/purchase.entity";

export class PurchaseFactoryMock {

    fromPurchaseDTO(params) {
      return <PurchaseProduct> {
        productId: "anyProductId",
      } as any;
    }

}