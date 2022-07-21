export class StockRepositoryMock {
    response: any;

    findByProduct() {
      return this.response;
    }
}