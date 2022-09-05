import { CqrsModule, EventBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { RegisterUserCommand } from './register-user.command';
import { RegisterUserCommandHandler } from './register-user-command.handler';
import { AuthRepository } from '../repositories/auth.repository';
import { AuthRepositoryMock } from '../../../mocks/auth-repository.mock';
import { UserRepositoryMock } from '../../../mocks/user-repository.mock';
import { EventBusMock } from '../../../mocks/event-bus.mock';
import { UserRegisteredEvent } from './events/user-registered.event';
import { UserRepository } from '../repositories/user.repository';
import { UserType } from '../../../authentication/model/user-type';
import { BadRequestException } from '@nestjs/common';
import { UserRegisteredInCompanyEvent } from './events/user-registered-in-company.event';

describe('RegisterUserCommandHandler', () => {

  let eventBus: EventBusMock;
  let handler: RegisterUserCommandHandler;

  let authRepository: AuthRepositoryMock;
  let userRepository: UserRepositoryMock;

  const command = new RegisterUserCommand(
    'anyCompanyId', 'anyCpf', 'anyEmail', 'anyName', 'anyPassword', 'anyPhone'
  );

  beforeEach(async () => {
    eventBus = new EventBusMock();

    authRepository = new AuthRepositoryMock();
    userRepository = new UserRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        RegisterUserCommandHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        AuthRepository,
        UserRepository
      ]
    })
    .overrideProvider(AuthRepository).useValue(authRepository)
    .overrideProvider(EventBus).useValue(eventBus)
    .overrideProvider(UserRepository).useValue(userRepository)
    .compile();

    handler = module.get<RegisterUserCommandHandler>(RegisterUserCommandHandler);
  });

  describe('given user doesnt exist', () => {

    const user = {
      companies: ["anyCompanyId"],
      cpfCnpj: "anyCpf",
      email: "anyEmail",
      name: "anyName",
      phone: "anyPhone",
      type: UserType.CLIENT
    };

    beforeEach(() => {
      authRepository.findUserByEmailResponse = null;
      authRepository.registerResponse = "anyUserUid";
    })

    it('then register user', async () => {
      await handler.execute(command);
  
      expect(authRepository.isRegistered).toBeTruthy();
    });
  
    it('when user registered, then create user', async () => {
      await handler.execute(command);
  
      expect(userRepository.createdWith).toEqual({
        uid: "anyUserUid", user
      });
    });
  
    it('when user created, then publish user created event', async () => {
      await handler.execute(command);
  
      expect(eventBus.published).toEqual(
        new UserRegisteredEvent("anyUserUid", command.companyId, {
          cpfCnpj: user.cpfCnpj, email: user.email, name: user.name,
          phone: user.phone, type: user.type
        })
      );
    });

  })

  describe('given user exists', () => {

    beforeEach(() => {
      authRepository.findUserByEmailResponse = "existingUserUid";
    })

    it('when user not created in current company, then add company to user', async () => {
      userRepository.response = {companies: ["anyOtherCompanyId"]} as any;

      await handler.execute(command);

      expect(userRepository.isCompanyAdded).toBeTruthy();
    })

    it('when user not created in current company, then public company added event', async () => {
      userRepository.response = {companies: ["anyOtherCompanyId"]} as any;

      await handler.execute(command);

      expect(eventBus.published).toEqual(
        new UserRegisteredInCompanyEvent(
          "existingUserUid", "anyCompanyId"
        )
      );
    })

    it('when user was already created for the company, then throw user already exists error', async () => {
      userRepository.response = {companies: ["anyCompanyId"]} as any;

      await expect(handler.execute(command)).rejects.toThrowError(BadRequestException);
    })

  });

});
