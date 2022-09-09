import { PurchaseProduct } from "./purchase-product.model"

describe('Purchase product model', () => {

    describe('hasEnoughItemsOnStock', () => {

        describe('given amount of products', () => {

            it('when higher then quantity on stock, then return false', () => {
                const purchaseProduct = new PurchaseProduct({
                    companyId: "anyCompanyId",
                    id: "anyProductId",
                    stock: {quantity: 10} as any,
                    amount: 15,
                    weight: 1
                })
    
                expect(purchaseProduct.hasEnoughItemsOnStock()).toBeFalsy();
            })
    
            it('when equal to quantity on stock, then return true', () => {
                const purchaseProduct = new PurchaseProduct({
                    companyId: "anyCompanyId",
                    id: "anyProductId",
                    stock: {quantity: 10} as any,
                    amount: 10,
                    weight: 1
                })
    
                expect(purchaseProduct.hasEnoughItemsOnStock()).toBeTruthy();
            })
    
            it('when lower then quantity on stock, then return true', () => {
                const purchaseProduct = new PurchaseProduct({
                    companyId: "anyCompanyId",
                    id: "anyProductId",
                    stock: {quantity: 10} as any,
                    amount: 5,
                    weight: 1
                })
    
                expect(purchaseProduct.hasEnoughItemsOnStock()).toBeTruthy();
            })

        })

    })

})