import { Injectable } from "@nestjs/common";
import { CalculatePriceDTO } from "../modules/purchases/dtos/calculate-price.dto";
import { CupomRepository } from "../repositories/cupom.repository";
import { PurchasePriceResponse } from "../models/purchase-price.model";
import { DeliveryService } from "./delivery.service";

@Injectable()
export class PurchasePriceService {

    constructor(
        private cupomRepository: CupomRepository,
        private deliveryService: DeliveryService
    ){}

    async calculatePrice(params: CalculatePriceDTO): Promise<PurchasePriceResponse> {
        if (!params.products?.length){
            return {
                productsPrice: 0,
                deliveryPrice: 0,
                discount: 0,
                paymentFee: 0,
                totalPrice: 0,
                totalWithPaymentFee: 0
            };
        }
        
        const deliveryPrice = await this.calculateDeliveryPrice(params);
        let cupomDiscount = 0;
        if (params.cupom) {
            cupomDiscount = await this.cupomRepository.findPercentage({
                companyId: params.company.id, cupom: params.cupom
            })
        }
        const productsPrice = this.calculateProductsPrice(params);
        const paymentFee = this.calculatePaymentFee(params, {productsPrice, deliveryPrice});

        let totalPrice = productsPrice + deliveryPrice;
        const discount = (totalPrice) * (cupomDiscount/100);
        totalPrice = totalPrice - discount;
        const totalWithPaymentFee = totalPrice + paymentFee;

        return {
            productsPrice,
            discount,
            deliveryPrice,
            paymentFee,
            totalPrice,
            totalWithPaymentFee
        };
    }

    private calculateProductsPrice(dto: CalculatePriceDTO) {
        let productsPrice = 0;
        dto.products.forEach(p => productsPrice += (p.amount * (p.priceWithDiscount || p.price)))
        return productsPrice;
    }

    private async calculateDeliveryPrice(dto: CalculatePriceDTO) {
        if (dto.address?.destinationZipCode) {
            return await this.deliveryService.calculateDelivery({
                address: {
                    destinationZipCode: dto.address.destinationZipCode,
                    originZipCode: dto.address.originZipCode,
                },
                cityDeliveryPrice: dto.cityDeliveryPrice,
                companyCity: dto.company.city,
                hasDeliveryByMail: dto.company.hasDeliveryByMail,
                products: dto.products
            });
        }
        return 0;
    }

    private calculatePaymentFee(dto: CalculatePriceDTO, {productsPrice, deliveryPrice}) {
        let paymentFee = 0;
        const fee = dto.payment?.creditCard?.fee;
        if (fee) {
            let totalPrice = productsPrice + deliveryPrice;
            paymentFee = (totalPrice * (fee.percentage / 100)) + fee.value;
        }
        return paymentFee;
    }
    
}