import { Address } from "./address.model";

export type Purchase = {
    readonly id: string;
    readonly address: Address;
}