import { RetryPurchaseDTO } from '../../dtos/retry-purchase.dto';
import { UserDTO } from '../../dtos/user.dto';

export class RetryPurchasePaymentCommand {

    constructor(
        public readonly companyId: string,
        public readonly purchaseId: string,
        public readonly retryPurchaseDto: RetryPurchaseDTO,
        public readonly user: UserDTO
    ){}

}