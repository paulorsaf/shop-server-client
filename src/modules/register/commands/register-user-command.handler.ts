import { BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { CommandHandler, EventBus, ICommandHandler } from "@nestjs/cqrs";
import { UserType } from "../../../authentication/model/user-type";
import { User } from "../entities/user";
import { AuthRepository } from "../repositories/auth.repository";
import { UserRepository } from "../repositories/user.repository";
import { UserRegisteredInCompanyEvent } from "./events/user-registered-in-company.event";
import { UserRegisteredEvent } from "./events/user-registered.event";
import { RegisterUserCommand } from "./register-user.command";

@CommandHandler(RegisterUserCommand)
export class RegisterUserCommandHandler implements ICommandHandler<RegisterUserCommand> {

    constructor(
        private eventBus: EventBus,
        private authRepository: AuthRepository,
        private userRepository: UserRepository
    ) {}

    async execute(command: RegisterUserCommand) {
        const existingUserUid = await this.authRepository.findUserByEmail(command.email);

        if (!existingUserUid) {
            await this.registerNewUser(command);
        } else {
            await this.addExistingUserToCompany(existingUserUid, command.companyId);
        }
    }

    private async registerNewUser(command: RegisterUserCommand) {
        const userUid = await this.registerUser(command);
    
        const user = this.createUser(command);
        await this.userRepository.createUser({uid: userUid, user});

        this.publishUserCreatedEvent(userUid, command, user);
    }

    private async registerUser(command: RegisterUserCommand) {
        try {
            return await this.authRepository.register(command.email, command.password);
        } catch (e) {
            throw new InternalServerErrorException(e);
        }
    }
    
    private createUser(command: RegisterUserCommand): User {
        return {
            companies: [command.companyId],
            cpfCnpj: command.cpfCnpj,
            email: command.email,
            name: command.name,
            password: command.password,
            phone: command.phone,
            type: UserType.CLIENT
        };
    }

    private publishUserCreatedEvent(userUid: string, command: RegisterUserCommand, user: User) {
        this.eventBus.publish(
            new UserRegisteredEvent(userUid, command.companyId, {
                cpfCnpj: user.cpfCnpj, email: user.email, name: user.name,
                password: user.password, phone: user.phone, type: user.type
            })
        );
    }

    private async addExistingUserToCompany(userId: string, companyId: string) {
        await this.verifyUserIsNotRegisteredInCompany(userId, companyId);

        await this.userRepository.addCompanyToUser(userId, companyId);

        this.publishUserRegisteredInCompanyEvent(userId, companyId);
    }

    private publishUserRegisteredInCompanyEvent(userUid: string, companyId: string) {
        this.eventBus.publish(
            new UserRegisteredInCompanyEvent(userUid, companyId)
        );
    }

    private async verifyUserIsNotRegisteredInCompany(userId: string, companyId: string) {
        const user = await this.userRepository.findByUid(userId);
        const isAddedToCompany = user.companies?.find(id => id === companyId);
        
        if (isAddedToCompany) {
            throw new BadRequestException("Email já cadastrado");
        }
    }

}