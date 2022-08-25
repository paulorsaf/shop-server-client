import { NotFoundException } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { CompanyRepository } from '../repositories/company.repository';
import { FindCompanyByIdQueryHandler } from './find-company-by-id-query.handler';
import { FindCompanyByIdQuery } from './find-company-by-id.query';

describe('FindCompanyByIdQueryHandler', () => {

  let handler: FindCompanyByIdQueryHandler;
  let query = new FindCompanyByIdQuery('anyCompanyId');

  let companyRepository: CompanyRepositoryMock;

  beforeEach(async () => {
    companyRepository = new CompanyRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        FindCompanyByIdQueryHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        CompanyRepository
      ]
    })
    .overrideProvider(CompanyRepository).useValue(companyRepository)
    .compile();

    handler = module.get<FindCompanyByIdQueryHandler>(FindCompanyByIdQueryHandler);
  });

  it('given company found, then return company', async () => {
    const company = {id: "anyCompanyId"};
    companyRepository._response = company;

    const response = await handler.execute(query);

    expect(response).toEqual(company)
  });

  it('given company not found, then throw not found exception', async () => {
    companyRepository._response = null;

    await expect(handler.execute(query)).rejects.toThrowError(NotFoundException);
  });

});

class CompanyRepositoryMock {
  _response;
  findById() {
    return this._response;
  }
}