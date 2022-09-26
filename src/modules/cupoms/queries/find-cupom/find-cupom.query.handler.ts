import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { format } from "date-fns";
import { CupomRepository } from "../../repositories/cupom.repository";
import { FindCupomQuery } from "./find-cupom.query";

@QueryHandler(FindCupomQuery)
export class FindCupomQueryHandler implements IQueryHandler<FindCupomQuery> {
    
    constructor(
        private cupomRepository: CupomRepository
    ) {}

    async execute(query: FindCupomQuery) {
        const cupom = await this.cupomRepository.find({
            companyId: query.companyId, cupom: query.cupom.toUpperCase()
        });

        if (cupom?.amountLeft === 0) {
            return null;
        }
        if (cupom?.expireDate) {
            const today = format(new Date(), 'yyyy-MM-dd');
            if (today > cupom.expireDate) {
                return null;
            }
        }
        return cupom;
    }

}