import { Injectable } from "@nestjs/common";
import { calcularPrecoPrazo, consultarCep, PrecoPrazoResponse } from "correios-brasil/dist";
import { resolve } from "path/posix";
import { Address } from "../model/address.model";

@Injectable()
export class DeliveryRepository {

    findDeliveryPrice(origin: string, destination: string): Promise<number> {
        const args = {
            sCepOrigem: origin.replace(/[^\d]/g, ''),
            sCepDestino: destination.replace(/[^\d]/g, ''),
            nVlPeso: '1',
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