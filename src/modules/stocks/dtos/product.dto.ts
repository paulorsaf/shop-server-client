import { StockDTO } from "./stock.dto";

export type ProductDTO = {
    readonly productId: string;
    readonly amount: number;
    readonly stock: StockDTO;
    readonly unit: string;
    readonly weight: number;
}