import { Purchase } from "./purchase.model";

describe("Purchases > Purchase model", () => {

    let purchaseRepository: PurchaseRepositoryMock;
    
    let purchase: Purchase;

    let product1: ProductMock;
    let product2: ProductMock;

    beforeEach(() => {
        purchaseRepository = new PurchaseRepositoryMock();

        product1 = new ProductMock();
        product2 = new ProductMock();

        purchase = new Purchase({
            companyId: "anyCompanyId", userId: "anyUserId", payment: {} as any,
            products: [product1, product2] as any, purchaseRepository
        })
    })

    describe('given save purchase', () => {

        beforeEach(() => {
            purchaseRepository._response = Promise.resolve('anyPurchaseId');
        })

        it('then save', async () => {
            await purchase.save();

            expect(purchaseRepository._isSaved).toBeTruthy();
        })

        it('when saved, then set purchase id', async () => {
            await purchase.save();

            expect(purchase.getId()).toEqual('anyPurchaseId');
        })

    })

    describe('given load all products', () => {

        it('then load products', async () => {
            await purchase.loadAllProducts();

            expect({
                found1: product1._isFound,
                found2: product2._isFound
            }).toEqual({
                found1: true,
                found2: true
            })
        })

    })

    describe('given find product out of stock', () => {

        it('when there is a product out of stock, then return product', async () => {
            product2._isOutOfStock = true;

            const product = purchase.findProductOutOfStock();

            expect(product).toEqual(product2);
        })

        it('when there are no products out of stock, then return undefined', async () => {
            product1._isOutOfStock = false;
            product2._isOutOfStock = false;

            const product = purchase.findProductOutOfStock();

            expect(product).toBeFalsy();
        })

    })

    describe('given find all by user and company', () => {

        it('then return purchases', async () => {
            const purchases = [{id: "anyPurchaseId1"}, {id: "anyPurchaseId2"}];
            purchaseRepository._response = purchases;

            await expect(purchase.findAllByUserAndCompany()).resolves.toEqual(purchases);
        })

    })

})

class PurchaseRepositoryMock {
    _isSaved = false;
    _response;

    findAll() {
        return this._response;
    }
    save() {
        this._isSaved = true;
        return this._response || Promise.resolve();
    }
}

class ProductMock {
    _isFound = false;
    _isOutOfStock = false;

    find() {
        this._isFound = true;
    }
    isOutOfStock() {
        return this._isOutOfStock;
    }
}