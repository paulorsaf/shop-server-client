import { Test, TestingModule } from '@nestjs/testing';
import { RegisterController } from './register.controller';
import { CommandBus, CqrsModule } from '@nestjs/cqrs';
import { UserRegister } from './dtos/user-register.dto';
import { CommandBusMock } from '../../mocks/command-bus.mock';
import { RegisterUserCommand } from './commands/register-user.command';
import { Company } from '../../authentication/model/company';
import { CompanyRepository } from '../../authentication/repositories/company/company.repository';

describe('RegisterController', () => {
  
  let controller: RegisterController;
  let commandBus: CommandBusMock;

  const company: Company = {id: 'anyCompanyId'} as any;
  const userRegister: UserRegister = {
    cpfCnpj: "anyCpf", email: "anyEmail", name: "anyName", password: "anyPassword", phone: "anyPhone"
  };

  beforeEach(async () => {
    commandBus = new CommandBusMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RegisterController],
      imports: [
        CqrsModule
      ],
      providers: [
        CompanyRepository
      ]
    })
    .overrideProvider(CommandBus).useValue(commandBus)
    .compile();

    controller = module.get<RegisterController>(RegisterController);
  });

  describe('given find categories by company', () => {

    it('then execute find categories by company query', async () => {
      await controller.register(company, userRegister);
  
      expect(commandBus.executed).toEqual(
        new RegisterUserCommand(
          company.id, userRegister.cpfCnpj, userRegister.email, userRegister.name,
          userRegister.password, userRegister.phone
        )
      );
    });

  })

});
