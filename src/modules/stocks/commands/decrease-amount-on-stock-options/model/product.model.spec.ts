import { Product } from "./product.model";

describe("Stocks > Product model", () => {

    let product: Product;
    let stock: StockMock;

    beforeEach(() => {
        stock = new StockMock();

        product = new Product({
            productId: "anyProductId", amount: 10, stock: stock as any
        })
    })

    it('given amount purchased, then decrease amount on stock', async () => {
        await product.decreaseAmountOnStock();

        expect(stock._hasDecreased).toBeTruthy();
    })

})

class StockMock {
    _hasDecreased = false;
    descreaseQuantityBy() {
        this._hasDecreased = true;
    }
}