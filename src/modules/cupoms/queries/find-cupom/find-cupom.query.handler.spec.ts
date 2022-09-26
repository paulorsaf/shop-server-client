import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { FindCupomQueryHandler } from './find-cupom.query.handler';
import { FindCupomQuery } from './find-cupom.query';
import { CupomRepository } from '../../repositories/cupom.repository';
import { Cupom } from '../../models/cupom.model';
import { addDays, format } from 'date-fns';

describe('FindCupomQueryHandler', () => {

  let handler: FindCupomQueryHandler;
  let query = new FindCupomQuery('anyCompanyId', 'anyCupomId');

  let cupomRepository: CupomRepositoryMock;

  beforeEach(async () => {
    cupomRepository = new CupomRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        FindCupomQueryHandler
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

    handler = module.get<FindCupomQueryHandler>(FindCupomQueryHandler);
  });

  describe('given cupom found', () => {
    
    let cupom;

    beforeEach(() => {
      cupom = {amountLeft: 10, expireDate: format(new Date(), 'yyyy-MM-dd')} as any;
      cupomRepository._response = cupom;
    })

    it('then return cupom', async () => {
      const response = await handler.execute(query);
  
      expect(response).toEqual(cupom);
    })

    it('when amount left is zero, then return null', async () => {
      cupom.amountLeft = 0;

      const response = await handler.execute(query);
  
      expect(response).toBeNull();
    })

    it('when expire date is before current day, then return null', async () => {
      cupom.expireDate = format(addDays(new Date(), -1), 'yyyy-MM-dd');

      const response = await handler.execute(query);
  
      expect(response).toBeNull();
    })

  })

  describe('given cupom not found', () => {

    it('then return null', async () => {
      cupomRepository._response = null;

      const response = await handler.execute(query);
  
      expect(response).toBeNull();
    })

  })

});

class CupomRepositoryMock {
  _response;
  find() {
    return this._response;
  }
}