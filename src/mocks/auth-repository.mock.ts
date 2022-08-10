export class AuthRepositoryMock {

    isRegistered = false;

    findUserByEmailResponse;
    registerResponse;

    findUserByEmail() {
        return this.findUserByEmailResponse;
    }

    register() {
        this.isRegistered = true;
        return this.registerResponse;
    }
}