import { Injectable } from "@nestjs/common";
import * as admin from 'firebase-admin';

@Injectable()
export class AuthRepository {

    async findUserByEmail(email: string): Promise<string> {
        return admin.auth()
            .getUserByEmail(email)
            .then(user => user.uid)
            .catch(() => Promise.resolve(null));
    }

    async register(email: string, password: string): Promise<string> {
        return admin.auth()
            .createUser({email, password})
            .then(user => user.uid);
    }

}