export class PurchaseRepositoryMock {
    createdWith: any;

    create(params) {
      this.createdWith = params;
    }
}