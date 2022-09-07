import { Injectable } from "@nestjs/common";
import { calcularPrecoPrazo, PrecoPrazoResponse } from "correios-brasil/dist";

@Injectable()
export class DeliveryRepository {

    findDeliveryPrice(params: FindDeliveryPrice): Promise<number> {
        const args = {
            sCepOrigem: params.origin.replace(/[^\d]/g, ''),
            sCepDestino: params.destination.replace(/[^\d]/g, ''),
            nVlPeso: params.totalWeight.toFixed(2),
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

}

type FindDeliveryPrice = {
    destination: string;
    origin: string;
    totalWeight: number;
}