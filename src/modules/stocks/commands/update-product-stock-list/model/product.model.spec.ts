import { Product } from "./product.model";

describe("Stocks > Product model", () => {

    let productRepository: ProductRepositoryMock;
    
    let product: Product;

    beforeEach(() => {
        productRepository = new ProductRepositoryMock();
        productRepository._totalStock = 20;

        product = new Product({
            productId: "anyProductId", productRepository: productRepository as any
        })
    })

    it('given update total stock, then update product stock with total stock', async () => {
        await product.updateTotalStock();

        expect(product.getTotalStock()).toEqual(20);
    })

    it('given update total stock, when product has total stock, then update', async () => {
        await product.updateTotalStock();

        expect(productRepository._isUpdated).toBeTruthy();
    })

})

class ProductRepositoryMock {
    _isUpdated = false;
    _totalStock = 0;

    getTotalStockByProduct() {
        return Promise.resolve(this._totalStock);
    }
    update() {
        this._isUpdated = true;
    }
}