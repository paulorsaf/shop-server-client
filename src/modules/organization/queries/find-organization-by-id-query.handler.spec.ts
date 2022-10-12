import { NotFoundException } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationRepository } from '../repositories/organization.repository';
import { FindOrganizationByIdQueryHandler } from './find-organization-by-id-query.handler';
import { FindOrganizationByIdQuery } from './find-organization-by-id.query';

describe('FindOrganizationByIdQueryHandler', () => {

  let handler: FindOrganizationByIdQueryHandler;
  let query = new FindOrganizationByIdQuery('anyOrganizationId');

  let organizationRepository: OrganizationRepositoryMock;

  beforeEach(async () => {
    organizationRepository = new OrganizationRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        FindOrganizationByIdQueryHandler
      ],
      imports: [
        CqrsModule
      ],
      providers: [
        OrganizationRepository
      ]
    })
    .overrideProvider(OrganizationRepository).useValue(organizationRepository)
    .compile();

    handler = module.get<FindOrganizationByIdQueryHandler>(FindOrganizationByIdQueryHandler);
  });

  it('given organization found, then return organization companies', async () => {
    const company = {id: "anyOrganizationId"};
    organizationRepository._response = company;

    const response = await handler.execute(query);

    expect(response).toEqual(company)
  });

  it('given organization not found, then throw not found exception', async () => {
    organizationRepository._response = null;

    await expect(handler.execute(query)).rejects.toThrowError(NotFoundException);
  });

});

class OrganizationRepositoryMock {
  _response;
  findCompaniesByOrganizationId() {
    return this._response;
  }
}