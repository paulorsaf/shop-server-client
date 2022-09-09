import { Injectable } from "@nestjs/common";
import { PurchasePriceResponse } from "../models/purchase-price.model";
import { DeliveryService } from "./delivery.service";

@Injectable()
export class PurchasePriceService {

    constructor(
        private deliveryService: DeliveryService
    ){}

    async calculatePrice(params: CalculatePriceParams): Promise<PurchasePriceResponse> {
        if (!params.products?.length){
            return {
                productsPrice: 0,
                deliveryPrice: 0,
                paymentFee: 0,
                totalPrice: 0,
                totalPriceWithPaymentFee: 0
            };
        }
        
        let productsPrice = this.calculateProductsPrice(params);
        let deliveryPrice = await this.calculateDeliveryPrice(params);
        let paymentFee = this.calculatePaymentFee(params, {productsPrice, deliveryPrice});

        return {
            productsPrice,
            deliveryPrice,
            paymentFee,
            totalPrice: productsPrice + deliveryPrice,
            totalPriceWithPaymentFee: productsPrice + deliveryPrice + paymentFee
        };
    }

    private calculateProductsPrice(dto: CalculatePriceParams) {
        let productsPrice = 0;
        dto.products.forEach(p => productsPrice += (p.amount * (p.priceWithDiscount || p.price)))
        return productsPrice;
    }

    private async calculateDeliveryPrice(dto: CalculatePriceParams) {
        if (dto.address?.destinationZipCode) {
            return await this.deliveryService.calculateDelivery({
                address: {
                    destinationZipCode: dto.address.destinationZipCode,
                    originZipCode: dto.address.originZipCode
                },
                cityDeliveryPrice: dto.cityDeliveryPrice,
                companyCity: dto.companyCity,
                products: dto.products
            });
        }
        return 0;
    }

    private calculatePaymentFee(dto: CalculatePriceParams, {productsPrice, deliveryPrice}) {
        let paymentFee = 0;
        const fee = dto.payment?.creditCard?.fee;
        if (fee) {
            let totalPrice = productsPrice + deliveryPrice;
            paymentFee = (totalPrice * (fee.percentage / 100)) + fee.value;
        }
        return paymentFee;
    }
    
}

type CalculatePriceParams = {
    readonly address: Address,
    readonly cityDeliveryPrice: number;
    readonly companyCity: string;
    readonly paymentType: string,
    readonly payment: Payment,
    readonly products: Product[]
}

type Address = {
    readonly destinationZipCode: string;
    readonly originZipCode: string;
}

type Payment = {
    readonly creditCard: {
        readonly fee: {
            readonly percentage: number;
            readonly value: number;
        }
    }
}

type Product = {
    readonly amount: number;
    readonly price: number;
    readonly priceWithDiscount?: number;
    readonly weight: number;
}