import { Injectable } from "@nestjs/common";
import { consultarCep } from "correios-brasil/dist";
import { Address } from "../models/address.model";

@Injectable()
export class AddressRepository {

    findByZipCode(zipCode: string): Promise<Address> {
        return consultarCep(zipCode.replace(/[^\d]/g, '')).then(response => {
            return {
                city: response.localidade,
                complement: response.complemento,
                neighborhood: response.bairro,
                state: response.uf,
                street: response.logradouro,
                zipCode: response.cep
            }
        });
    }

}