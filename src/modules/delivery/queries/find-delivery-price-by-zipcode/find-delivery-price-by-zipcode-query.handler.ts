import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { ZipCodeNotFoundException } from "../../exceptions/zipcode-not-found.exception";
import { FindDeliveryPriceByZipCodeQuery } from "./find-delivery-price-by-zipcode.query";
import { DeliveryService } from "../../../../services/delivery.service";

@QueryHandler(FindDeliveryPriceByZipCodeQuery)
export class FindDeliveryPriceByZipCodeQueryHandler implements IQueryHandler<FindDeliveryPriceByZipCodeQuery> {
    
    constructor(
        private deliveryService: DeliveryService
    ){}

    async execute(query: FindDeliveryPriceByZipCodeQuery) {
        try {
            return await this.deliveryService.calculateDelivery({
                address: {
                    destinationZipCode: query.zipCode,
                    originZipCode: query.company.address.zipCode
                },
                cityDeliveryPrice: query.company.cityDeliveryPrice,
                companyCity: query.company.address.city,
                products: query.products
            });
        } catch (error) {
            throw new ZipCodeNotFoundException();
        }
    }

}