import { Stock } from "./stock.model";

describe("Purchases > Stock model", () => {

    let stockRepository: StockRepositoryMock;
    
    let stock: Stock;

    beforeEach(() => {
        stockRepository = new StockRepositoryMock();
    })

    describe('given find by id and product id', () => {

        beforeEach(() => {
            stock = new Stock({
                id: "anyStockId", productId: "anyProductId", stockRepository
            })
        })

        it('when stock not found, then dont populate stock', async () => {
            stockRepository._response = Promise.resolve(null);

            await stock.findByProductAndId();

            expect(stock).toEqual(
                new Stock({
                    id: "anyStockId", productId: "anyProductId", stockRepository
                })
            );
        })

        it('when stock found, then populate stock', async () => {
            stockRepository._response = Promise.resolve({
                color: "anyColor", quantity: 10, size: "anySize"
            })

            await stock.findByProductAndId();

            expect(stock).toEqual(
                new Stock({
                    id: "anyStockId", productId: "anyProductId", quantity: 10,
                    color: "anyColor", size: "anySize", stockRepository
                })
            )
        })

    })

    describe('given stock', () => {

        it('when stock quantity is not informed, then shouldnt have stock', async () => {
            const stock = new Stock({
                id: "anyStockId", productId: "anyProductId", quantity: null
            })

            expect(stock.hasStock()).toBeFalsy();
        })

        it('when stock quantity is lower than zero, then shouldnt have stock', async () => {
            const stock = new Stock({
                id: "anyStockId", productId: "anyProductId", quantity: -1
            })

            expect(stock.hasStock()).toBeFalsy();
        })

        it('when stock quantity is zero, then shouldnt have stock', async () => {
            const stock = new Stock({
                id: "anyStockId", productId: "anyProductId", quantity: 0
            })

            expect(stock.hasStock()).toBeFalsy();
        })

        it('when stock quantity is higher than zero, then should have stock', async () => {
            const stock = new Stock({
                id: "anyStockId", productId: "anyProductId", quantity: 1
            })

            expect(stock.hasStock()).toBeTruthy();
        })

    })

})

class StockRepositoryMock {
    _decreasedBy = 0;
    _response;

    findByIdAndProduct() {
        return this._response || Promise.resolve();
    }
}