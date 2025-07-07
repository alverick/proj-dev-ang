import { TestBed } from '@angular/core/testing';
import { type ActivatedRouteSnapshot } from '@angular/router';
import { MockProvider } from 'ng-mocks';
import { of, throwError } from 'rxjs';

import { type IAccountStateDetails } from '../../../shared/models/company';
import { CompanyService } from '../../../shared/services';
import { AccountStateDetailsResolver } from './account-state-details.resolver';

describe('AccountStateDetailsResolver', () => {
  let resolver: AccountStateDetailsResolver;
  let companyService: CompanyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AccountStateDetailsResolver,
        MockProvider(CompanyService, {
          getAccountStateDetails: jest.fn(),
        }),
      ],
    });

    resolver = TestBed.inject(AccountStateDetailsResolver);
    companyService = TestBed.inject(CompanyService);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should return "Invalid account key" when llave is missing', (done) => {
    const mockRoute = { params: {} } as ActivatedRouteSnapshot;

    resolver.resolve(mockRoute).subscribe((result) => {
      expect(result).toBe('Invalid account key');
      done();
    });
  });

  it('should return account state details when service call succeeds', (done) => {
    const mockData = {
      /* mock IAccountStateDetails data */
    } as IAccountStateDetails;
    const accountKey = 'valid-key';
    const mockRoute = {
      params: { llave: accountKey },
    } as unknown as ActivatedRouteSnapshot;

    jest
      .spyOn(companyService, 'getAccountStateDetails')
      .mockReturnValue(of(mockData));

    resolver.resolve(mockRoute).subscribe((result) => {
      expect(companyService.getAccountStateDetails).toHaveBeenCalledWith(
        accountKey,
      );
      expect(result).toEqual(mockData);
      done();
    });
  });

  it('should return error message when service call fails', (done) => {
    const accountKey = 'valid-key';
    const mockRoute = {
      params: { llave: accountKey },
    } as unknown as ActivatedRouteSnapshot;

    jest
      .spyOn(companyService, 'getAccountStateDetails')
      .mockReturnValue(throwError(() => new Error('Test error')));

    resolver.resolve(mockRoute).subscribe((result) => {
      expect(companyService.getAccountStateDetails).toHaveBeenCalledWith(
        accountKey,
      );
      expect(result).toBe('Failed to load account state details');
      done();
    });
  });
});
