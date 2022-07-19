export class CategoryRepositoryMock {
    response: any;

    findByCompany() {
      return this.response;
    }
}