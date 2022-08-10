export class UserRepositoryMock {

  isCompanyAdded = false;
  isCreated = false;

  createdWith: any;
  response: any;

  addCompanyToUser() {
    this.isCompanyAdded = true;
  }

  createUser(params) {
    this.createdWith = params;
    this.isCreated = true;
    return this.response;
  }

  findByUid() {
    return this.response;
  }

}