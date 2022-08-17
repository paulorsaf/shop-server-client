import { Stock } from "./stock.model";

describe("Stocks > Stock model", () => {

    let stockRepository: StockRepositoryMock;

    beforeEach(() => {
        stockRepository = new StockRepositoryMock();
    })

    describe('given decrease stock by quantity', () => {

        it('then decrease stock', async () => {
            const stock = new Stock({
                id: "anyStockId", quantity: 10, stockRepository
            });

            await stock.descreaseQuantityBy(3);

            expect(stockRepository._decreasedBy).toEqual(3);
        })

        it('when quantity decreased, then update stock quantity', async () => {
            const stock = new Stock({
                id: "anyStockId", quantity: 10, stockRepository
            });

            await stock.descreaseQuantityBy(3);

            expect(stock.getQuantity()).toEqual(7);
        })

    })

})

class StockRepositoryMock {
    _decreasedBy = 0;
    _response;

    descreaseQuantityBy({decreaseBy}) {
        this._decreasedBy = decreaseBy;
        return Promise.resolve(-this._decreasedBy)
    }
    findByIdAndProduct() {
        return this._response || Promise.resolve();
    }
}