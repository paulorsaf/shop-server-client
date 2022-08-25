import { NotFoundException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { CompanyRepository } from "../repositories/company.repository";
import { FindCompanyByIdQuery } from "./find-company-by-id.query";

@QueryHandler(FindCompanyByIdQuery)
export class FindCompanyByIdQueryHandler implements IQueryHandler<FindCompanyByIdQuery> {

    constructor(
        private companyRepository: CompanyRepository
    ){}

    async execute(query: FindCompanyByIdQuery) {
        const company = await this.companyRepository.findById(query.companyId);
        if (!company) {
            throw new NotFoundException("Empresa nao encontrada");
        }
        return company;
    }

}