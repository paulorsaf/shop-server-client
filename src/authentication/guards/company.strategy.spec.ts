import { UnauthorizedException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CompanyRepositoryMock } from '../../mocks/company-repository.mock';
import { CompanyRepository } from '../repositories/company/company.repository';
import { CompanyStrategy } from './company.strategy';

describe('Company Strategy', () => {
  let service: CompanyStrategy;
  let companyRepository: CompanyRepositoryMock;
  
  let context: ExecutionContextMock;

  const company = {id: 1} as any;

  beforeEach(async () => {
    companyRepository = new CompanyRepositoryMock();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyStrategy,
        CompanyRepository
      ]
    })
    .overrideProvider(CompanyRepository).useValue(companyRepository)
    .compile();

    service = module.get<CompanyStrategy>(CompanyStrategy);
  });

  it('given company id not present in header, then return unauthorized exception', async () => {
    context = new ExecutionContextMock("");

    await expect(service.canActivate(<any> context)).rejects.toThrowError(UnauthorizedException);
  });

  it('given company id is present in header, when company exists, then return true', async () => {
    companyRepository.response = Promise.resolve(company);

    context = new ExecutionContextMock("companyId");

    expect(await service.canActivate(<any> context)).toBeTruthy();
  });

  it('given company id is present in header, when company exists, then add company to request', done => {
    companyRepository.response = Promise.resolve(company);
    
    context = new ExecutionContextMock("companyId");

    service.canActivate(<any> context).then(() => {
      expect(context._request.request.company).toEqual(company);
      done();
    });
  });

  it('given company id is present in header, when company doesnt exist, then throw unauthorized exception', async () => {
    companyRepository.response = Promise.resolve(null);

    context = new ExecutionContextMock("companyId");

    await expect(service.canActivate(<any> context)).rejects.toThrowError(UnauthorizedException);
  });

  class ExecutionContextMock {
    _company = "";
    _request: RequestMock;

    constructor(token: string) {
      this._company = token;
    }

    switchToHttp() {
      this._request = new RequestMock(this._company);
      return this._request;
    }
  }

  class RequestMock {
    _company = "";
    request: any;

    constructor(company: string) {
      this._company = company;
    }

    getRequest() {
      this.request = {
        headers: {
          company: this._company,
        },
        user: null
      }
      return this.request;
    }
  }

});