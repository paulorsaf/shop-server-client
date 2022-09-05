import { UserType } from "src/authentication/model/user-type";

export type User = {
    companies: string[],
    cpfCnpj: string,
    email: string,
    name: string,
    password?: string,
    phone: string,
    type: UserType;
}