export class CompanyRepositoryMock {
    response: any;

    findById() {
      return this.response;
    }
}