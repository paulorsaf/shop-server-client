import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ZipCodeNotFoundException } from "../../exceptions/zipcode-not-found.exception";
import { AddressRepository } from "../../repositories/address.repository";
import { DeliveryRepository } from "../../repositories/delivery.repository";
import { FindDeliveryPriceByZipCodeQuery } from "./find-delivery-price-by-zipcode.query";

@QueryHandler(FindDeliveryPriceByZipCodeQuery)
export class FindDeliveryPriceByZipCodeQueryHandler implements IQueryHandler<FindDeliveryPriceByZipCodeQuery> {
    
    constructor(
        private addressRepository: AddressRepository,
        private deliveryRepository: DeliveryRepository
    ){}

    async execute(query: FindDeliveryPriceByZipCodeQuery) {
        try {
            const address = await this.findByZipCode(query.zipCode);
            if (address.city === query.company.address.city) {
                return query.company.cityDeliveryPrice || 0;
            }
            return this.deliveryRepository.findDeliveryPrice(
                query.company.address.zipCode, query.zipCode
            );
        } catch (error) {
            throw new ZipCodeNotFoundException();
        }
    }

    private async findByZipCode(zipCode: string) {
        const address = await this.addressRepository.findByZipCode(zipCode);
        if (!address) {
            throw new ZipCodeNotFoundException();
        }
        return address;
    }

}