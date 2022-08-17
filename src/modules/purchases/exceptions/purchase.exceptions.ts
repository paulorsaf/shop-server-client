import { InternalServerErrorException, NotFoundException } from "@nestjs/common";

export class ProductNotFoundException extends NotFoundException {
    constructor(productName: string) {
        super(`'${productName}' nao existe`);
    }
}

export class ProductDoesntBelongToCompanyException extends NotFoundException {
    constructor(productName: string) {
        super(`'${productName}' nao existe nessa loja`);
    }
}

export class StockNotFoundException extends NotFoundException {
    constructor(productName: string) {
        super(`Estoque para o produto '${productName}' nao encontrado`);
    }
}

export class ProductOutOfStockException extends InternalServerErrorException {
    constructor(productName: string) {
        super(`Produto '${productName}' nao está mais disponível no estoque`);
    }
}