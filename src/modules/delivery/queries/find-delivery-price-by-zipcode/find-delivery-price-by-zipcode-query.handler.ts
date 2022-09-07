import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ProductDTO } from "../../dtos/product.dto";
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
            return this.deliveryRepository.findDeliveryPrice({
                origin: query.company.address.zipCode,
                destination: query.zipCode,
                totalWeight: this.getProductsTotalWeight(query.products)
            });
        } catch (error) {
            throw new ZipCodeNotFoundException();
        }
    }

    private getProductsTotalWeight(products: ProductDTO[]) {
        if (!products?.length) {
            return 1;
        }

        let total = 0;
        products.filter(p => p.amount && p.weight).forEach(p => {
            total += (p.amount * p.weight)
        });
        return total || 1;
    }

    private async findByZipCode(zipCode: string) {
        const address = await this.addressRepository.findByZipCode(zipCode);
        if (!address) {
            throw new ZipCodeNotFoundException();
        }
        return address;
    }

}