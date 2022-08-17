import { ProductDoesntBelongToCompanyException, ProductNotFoundException, StockNotFoundException } from "../exceptions/purchase.exceptions";
import { Product } from "./product.model";

describe("Purchases > Product model", () => {

    let productRepository: ProductRepositoryMock;
    
    let product: Product;
    let stock: StockMock;

    beforeEach(() => {
        productRepository = new ProductRepositoryMock();
        stock = new StockMock();

        product = new Product(
            "anyCompanyId", "anyProductId", 10, stock as any,
            null, null, null, null, productRepository
        )
    })

    describe('given find product', () => {

        it('when stock not informed, then throw stock not found exception', async () => {
            product = new Product(
                "anyCompanyId", "anyProductId", 10, null,
                null, null, null, null, productRepository
            )
            
            await expect(product.find()).rejects.toThrowError(StockNotFoundException);
        })

        it('when product not found, then throw product not found exception', async () => {
            productRepository._response = Promise.resolve(null);

            await expect(product.find()).rejects.toThrowError(ProductNotFoundException);
        })

        it('when product doesnt belong to company, then throw product doesnt belong to company exception', async () => {
            productRepository._response = Promise.resolve({companyId: "anyOtherCompanyId"});

            await expect(product.find()).rejects.toThrowError(ProductDoesntBelongToCompanyException);
        })

        describe('when product found', () => {

            beforeEach(async () => {
                productRepository._response = Promise.resolve({
                    companyId: "anyCompanyId", name: "anyName", price: 10, priceWithDiscount: 8,
                    description: "anyDescription"
                });
            })

            it('then populate product', async () => {
                await product.find();

                expect(product).toEqual(
                    new Product(
                        "anyCompanyId", "anyProductId", 10, stock as any,
                        "anyName", 10, 8, "anyDescription", productRepository as any
                    )
                );
            })

            it('then find stock', async () => {
                await product.find();

                expect(stock._foundByProductAndId).toBeTruthy();
            })

            it('and product doesnt have stock, then throw stock not found exception', async () => {
                stock._hasStock = false;

                await expect(product.find()).rejects.toThrowError(StockNotFoundException);
            })

        })

    })

    describe('given product stock', () => {

        it('when product amount is higher than stock quantity, then return true', () => {
            stock._quantity = 5;

            expect(product.isOutOfStock()).toBeTruthy();
        })

        it('when product amount is equal to stock quantity, then return false', () => {
            stock._quantity = 10;

            expect(product.isOutOfStock()).toBeFalsy();
        })

        it('when product amount is lower than stock quantity, then return false', () => {
            stock._quantity = 15;

            expect(product.isOutOfStock()).toBeFalsy();
        })

    })

})

class ProductRepositoryMock {

    _response;

    findById() {
        return this._response;
    }
}
class StockMock {
    _decreasedBy = 0;
    _foundByProductAndId = false;
    _hasStock = true;
    _quantity = 0;

    findByProductAndId() {
        this._foundByProductAndId = true;
    }
    getQuantity() {
        return this._quantity;
    }
    hasStock() {
        return this._hasStock;
    }
}