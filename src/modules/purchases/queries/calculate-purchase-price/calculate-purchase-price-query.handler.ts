import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { CalculatePurchasePriceQuery } from "./calculate-purchase-price.query";
import { PurchasePrice } from "shop-purchase-price";
import { CupomRepository } from "../../repositories/cupom.repository";

@QueryHandler(CalculatePurchasePriceQuery)
export class CalculatePurchasePriceQueryHandler implements IQueryHandler<CalculatePurchasePriceQuery> {

    constructor(
        private cupomRepository: CupomRepository
    ){}

    async execute(query: CalculatePurchasePriceQuery) {
        const discount = await this.findDiscount(query);

        const pricing = await new PurchasePrice({
            addresses: query.dto.address ? {
                destination: query.dto.address.destinationZipCode,
                origin: query.dto.address.originZipCode
            } : null,
            innerCityDeliveryPrice: query.dto.cityDeliveryPrice,
            originCityName: query.dto.company.city,
            discount,
            paymentFee: query.dto.paymentType === 'CREDIT_CARD' ? {
                percentage: query.dto.payment?.creditCard?.fee?.percentage || 0,
                value: query.dto.payment?.creditCard?.fee?.value || 0
            } : null,
            products: query.dto.products.map(p => ({
                amount: p.amount,
                price: p.price,
                priceWithDiscount: p.priceWithDiscount,
                weight: p.weight
            })),
            serviceFee: query.dto.company.serviceTax
        }).calculatePrice();

        return pricing;
    }

    private async findDiscount(query: CalculatePurchasePriceQuery) {
        if (!query.dto.cupom) {
            return 0;
        }

        const cupom = await this.cupomRepository.find({
            companyId: query.dto.company.id,
            cupom: query.dto.cupom
        })

        return cupom?.discount || 0;
    }
    
}