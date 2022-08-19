import { Injectable } from "@nestjs/common";
import { PurchaseRepository } from "../repositories/purchase.repository";
import { Product } from "./product.model";

@Injectable()
export class Purchase {

    #purchaseRepository: PurchaseRepository;

    private createdAt: string;
    private id: string;
    private companyId: string;
    private userId: string;
    private address: PurchaseAddress;
    private products: Product[];
    private payment: Payment;
    private status: string;
    
    constructor(params: PurchaseParams){
        this.id = params.id;
        this.createdAt = params.createdAt;
        this.companyId = params.companyId;
        this.userId = params.userId;
        this.address = params.address;
        this.products = params.products;
        this.payment = params.payment;
        this.status = params.status;
        this.#purchaseRepository = params.purchaseRepository || new PurchaseRepository();
    }

    async save() {
        await this.#purchaseRepository.save(this).then(id => {
            this.id = id; 
        })
    }

    async loadAllProducts() {
        await Promise.all(this.products.map(p => p.find()))
    }

    async findAllByUserAndCompany() {
        return await this.#purchaseRepository.findAll({
            companyId: this.companyId,
            userId: this.userId
        });
    }

    findProductOutOfStock() {
        return this.products.find(p => p.isOutOfStock());
    }

    getId() {
        return this.id;
    }

    getCompanyId() {
        return this.companyId;
    }

    getProducts() {
        return this.products;
    }

    getUserId() {
        return this.userId;
    }

}

type PurchaseParams = {
    createdAt?: string;
    companyId: string;
    id?: string;
    userId: string;
    address?: PurchaseAddress;
    products?: Product[];
    payment?: Payment;
    purchaseRepository?: PurchaseRepository;
    status?: string;
}

type PurchaseAddress = {
    street: string;
    number: string;
    complement: string;
    neighborhood: string;
    zipCode: string;
    city: string;
    state: string;
    latitude: number;
    longitude: number;
}

type Payment = {
    type: string;
}