export class PurchaseGeolocationSavedEvent {
    private readonly eventType = "PURCHASE_GEOLOCATION_SAVED_EVENT";
    constructor(
        public readonly companyId: string,
        public readonly purchaseId: string,
        public readonly location: {latitude: number; longitude: number}
    ){}
}