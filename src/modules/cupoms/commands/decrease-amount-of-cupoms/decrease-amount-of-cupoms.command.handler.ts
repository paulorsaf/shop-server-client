import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CupomRepository } from "../../repositories/cupom.repository";
import { DecreaseAmountOfCupomsCommand } from "./decrease-amount-of-cupoms.command";

@CommandHandler(DecreaseAmountOfCupomsCommand)
export class DecreaseAmountOfCupomsCommandHandler implements ICommandHandler<DecreaseAmountOfCupomsCommand> {

    constructor(
        private cupomRepository: CupomRepository
    ){}

    async execute(command: DecreaseAmountOfCupomsCommand) {
        if (command.cupom) {
            const cupom = await this.cupomRepository.find({
                companyId: command.companyId, cupom: command.cupom?.toUpperCase()
            });
            if (cupom) {
                this.cupomRepository.decreaseAmountLeftById(cupom.id);
            }
        }
    }

}