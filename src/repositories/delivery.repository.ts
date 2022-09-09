import { Injectable } from "@nestjs/common";
import { calcularPrecoPrazo, PrecoPrazoResponse } from "correios-brasil/dist";

@Injectable()
export class DeliveryRepository {

    findDeliveryPrice(params: FindDeliveryPrice): Promise<number> {
        const totalWeight = this.getProductsTotalWeight(params.products);

        const args = {
            sCepOrigem: params.origin.replace(/[^\d]/g, ''),
            sCepDestino: params.destination.replace(/[^\d]/g, ''),
            nVlPeso: totalWeight.toFixed(2),
            nCdFormato: '1',
            nVlComprimento: '20',
            nVlAltura: '20',
            nVlLargura: '20',
            nCdServico: ['04014'],
            nVlDiametro: '0',
        };
          
        return calcularPrecoPrazo(args).then((response: PrecoPrazoResponse) => {
            return parseFloat(response[0].Valor.replace(',', '.'));
        });
    }

    private getProductsTotalWeight(products: {amount: number, weight: number}[]) {
        if (!products?.length) {
            return 1;
        }

        let total = 0;
        products.filter(p => p.amount && p.weight).forEach(p => {
            total += (p.amount * p.weight)
        });
        return total || 1;
    }

}

type FindDeliveryPrice = {
    destination: string;
    origin: string;
    products: {amount: number, weight: number}[];
}