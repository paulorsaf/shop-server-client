export class BannerRepositoryMock {
    response: any;

    findByCompany() {
      return this.response;
    }
}