import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { DecreaseAmountOfCupomsCommandHandler } from './decrease-amount-of-cupoms.command.handler';
import { DecreaseAmountOfCupomsCommand } from './decrease-amount-of-cupoms.command';
import { CupomRepository } from '../../repositories/cupom.repository';

describe('DecreaseAmountOfCupomsCommandHandler', () => {

  let handler: DecreaseAmountOfCupomsCommandHandler;
  let command = new DecreaseAmountOfCupomsCommand(
    'anyCompanyId', 'anyCupom', "anyUserId"
  );

  let cupomRepository: CupomRepositoryMock;

  beforeEach(async () => {
    cupomRepository = new CupomRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        DecreaseAmountOfCupomsCommandHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        CupomRepository
      ]
    })
    .overrideProvider(CupomRepository).useValue(cupomRepository)
    .compile();

    handler = module.get<DecreaseAmountOfCupomsCommandHandler>(DecreaseAmountOfCupomsCommandHandler);
  });

  it('given cupom not sent to command then do not decrease cupom', async () => {
    let command = new DecreaseAmountOfCupomsCommand(
      'anyCompanyId', null, "anyUserId"
    );

    await handler.execute(command);

    expect(cupomRepository._isDecreased).toBeFalsy();
  })

  describe('given cupom found', () => {

    let cupom;

    beforeEach(() => {
      cupom = {id: "anyCupom", amountLeft: 10}
      cupomRepository._response = cupom;
    })

    it('when there are cupoms left, then decrease amount of cupoms left', async () => {
      await handler.execute(command);

      expect(cupomRepository._isDecreased).toBeTruthy();
    })

  })

  describe('given cupom not found', () => {

    it('then do not decrease amount of cupoms left', async () => {
      await handler.execute(command);

      expect(cupomRepository._isDecreased).toBeFalsy();
    })

  })

});

class CupomRepositoryMock {
  _isDecreased = false;
  _response;
  find() {
    return this._response;
  }
  decreaseAmountLeftById() {
    this._isDecreased = true;
  }
}