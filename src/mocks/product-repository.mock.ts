export class ProductRepositoryMock {
    response: any;

    findByCompanyAndCategory() {
      return this.response;
    }
}