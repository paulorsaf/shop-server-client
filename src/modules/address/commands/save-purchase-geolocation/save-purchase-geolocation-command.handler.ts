import { NotFoundException } from "@nestjs/common";
import { CommandHandler, ICommandHandler, EventBus } from "@nestjs/cqrs";
import { PurchaseGeolocationSavedEvent } from "../../events/puchase-geolocation-saved.event";
import { LatLng } from "../../model/lag-lnt.model";
import { AddressRepository } from "../../repositories/address.repository";
import { PurchaseRepository } from "../../repositories/purchase.repository";
import { SavePurchaseGeolocationCommand } from "./save-purchase-geolocation.command";

@CommandHandler(SavePurchaseGeolocationCommand)
export class SavePurchaseGeolocationCommandHandler implements ICommandHandler<SavePurchaseGeolocationCommand> {

    constructor(
        private addressRepository: AddressRepository,
        private eventBus: EventBus,
        private purchaseRepository: PurchaseRepository
    ){}

    async execute(command: SavePurchaseGeolocationCommand) {
        const purchase = await this.findPurchase(command);

        if (purchase.address?.zipCode) {
            const latLng = await this.findGeolocation(purchase.address.zipCode);
            if (latLng) {
                await this.purchaseRepository.updateGeolocation({purchaseId: purchase.id, latLng});
                
                this.publishPurchaseGeolocationSavedEvent(command, latLng);
            }
        }
    }

    private async findPurchase(command: SavePurchaseGeolocationCommand) {
        const purchase = await this.purchaseRepository.findByIdAndCompanyId({
            companyId: command.companyId, purchaseId: command.purchaseId
        });
        if (!purchase) {
            throw new NotFoundException();
        }
        return purchase;
    }

    private async findGeolocation(zipCode: string) {
        try {
            return await this.addressRepository.findGeolocationByZipCode(zipCode);
        } catch (error) {
            return null;
        }
    }

    private publishPurchaseGeolocationSavedEvent(
        command: SavePurchaseGeolocationCommand, latLng: LatLng
    ) {
        this.eventBus.publish(
            new PurchaseGeolocationSavedEvent(
                command.companyId,
                command.purchaseId,
                latLng
            )
        )
    }

}