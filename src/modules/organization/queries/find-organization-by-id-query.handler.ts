import { NotFoundException } from "@nestjs/common";
import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { OrganizationRepository } from "../repositories/organization.repository";
import { FindOrganizationByIdQuery } from "./find-organization-by-id.query";

@QueryHandler(FindOrganizationByIdQuery)
export class FindOrganizationByIdQueryHandler implements IQueryHandler<FindOrganizationByIdQuery> {

    constructor(
        private organizationRepository: OrganizationRepository
    ){}

    async execute(query: FindOrganizationByIdQuery) {
        const company = await this.organizationRepository.findCompaniesByOrganizationId(
            query.organizationId
        );
        if (!company) {
            throw new NotFoundException("Empresa não encontrada");
        }
        return company;
    }

}