import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { CompanyRepository } from '../repositories/company/company.repository';

@Injectable()
export class CompanyStrategy implements CanActivate {

    constructor(
        private companyRepository: CompanyRepository
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const company = request.headers.company;
        if (!company) {
            throw new UnauthorizedException('Empresa nao identificada');
        }

        return this.companyRepository.findById(company).then(company => {
            if (!company) {
                throw new UnauthorizedException('Empresa nao encontrada')
            }
            request.company = company;
            return true;
        })
    }

}