import { Injectable } from "@nestjs/common";
import { AddressRepository } from "../repositories/address.repository";
import { DeliveryRepository } from "../repositories/delivery.repository";
import { ZipCodeNotFoundException } from "../exceptions/zipcode-not-found.exception";

@Injectable()
export class DeliveryService {

    constructor(
        private addressRepository: AddressRepository,
        private deliveryRepository: DeliveryRepository
    ){}

    async calculateDelivery(params: CalculateDelivery) {
        const address = await this.findByZipCode(params.address.destinationZipCode);
        if (address.city === params.companyCity) {
            return params.cityDeliveryPrice || 0;
        }
        return this.deliveryRepository.findDeliveryPrice({
            origin: params.address.originZipCode,
            destination: params.address.destinationZipCode,
            products: params.products
        });
    }

    private async findByZipCode(zipCode: string) {
        const address = await this.addressRepository.findByZipCode(zipCode);
        if (!address) {
            throw new ZipCodeNotFoundException();
        }
        return address;
    }

}

type CalculateDelivery = {
    address: Address;
    cityDeliveryPrice: number;
    companyCity: string;
    products: {amount: number, weight: number}[];
}

type Address = {
    readonly destinationZipCode: string;
    readonly originZipCode: string;
}