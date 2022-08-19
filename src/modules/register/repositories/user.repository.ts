import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { format } from "date-fns";
import { User } from '../entities/user';

@Injectable()
export class UserRepository {

    async addCompanyToUser(uid: string, companyId: string) {
        return admin.firestore()
            .collection('users')
            .doc(uid)
            .update({
                companies: admin.firestore.FieldValue.arrayUnion(companyId)
            })
    }

    async createUser(createUser: CreateUser) {
        return admin.firestore()
            .collection('users')
            .doc(createUser.uid)
            .create({
                ...createUser.user,
                createdAt: format(new Date(), 'yyyy-MM-dd HH:mm:ss')
            })
    }

    async findByUid(uid: string) {
        return admin.firestore()
            .collection('users')
            .doc(uid)
            .get()
            .then(snapshot => <User> snapshot.data())
    }

}

type CreateUser = {
    uid: string,
    user: User
}