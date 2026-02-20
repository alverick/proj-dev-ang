import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { NGXLogger } from 'ngx-logger';
import { of, throwError } from 'rxjs';

import {
  CompanyService,
  DigitalDataService,
  EnterpriseHeadingService,
  ServicesFormsService,
  TrackingService,
} from '../../../shared/services';
import { LoginService } from '../../../shared/services/login.service';
import { StorageService } from '../../../shared/services/storage.service';
import { AffiliationService } from './affiliation.service';
import { AffiliationFormsService } from './affiliation-forms.service';

describe('AffiliationService', () => {
  beforeEach(() => {
    return MockBuilder(AffiliationService)
      .keep(FormBuilder)
      .mock(AffiliationFormsService, {
        registerForm: new FormBuilder().group({
          documentType: ['DNI', [Validators.required]],
          documentNumber: ['12345678', [Validators.required]],
          ruc: ['12345678901', [Validators.required]],
          email: ['test@example.com', [Validators.required]],
          emailConfirm: ['test@example.com', [Validators.required]],
          movilNumber: ['987654321', [Validators.required]],
          movilOperator: ['CLARO', [Validators.required]],
        }),
        authForm: new FormBuilder().group({
          ruc: ['12345678901'],
          name: ['Test Company'],
          nameSelect: ['Test Company'],
          entry: ['1'],
          entrySelect: [{ code: '1', name: 'Entry 1' }],
          password: ['Password123!'],
          passwordConfirm: ['Password123!'],
          acceptTerms: [true],
        }),
      })
      .mock(CompanyService, {
        validateCompany: jest.fn(() =>
          of({
            success: true,
            tradeName: 'Test Trade Name',
            fullName: 'Test Full Name',
          }),
        ),
      })
      .mock(EnterpriseHeadingService)
      .mock(ServicesFormsService)
      .mock(DigitalDataService)
      .mock(LoginService)
      .mock(StorageService)
      .mock(Router)
      .mock(TrackingService)
      .mock(NGXLogger)
      .provide(provideMockStore({}));
  });

  it('should be created', () => {
    const service = MockRender(AffiliationService).point.componentInstance;
    expect(service).toBeTruthy();
  });

  describe('validateCompany', () => {
    it('should return success true if form is valid', (done) => {
      const fixture = MockRender(AffiliationService);
      const service = fixture.point.componentInstance;
      const companyService = ngMocks.findInstance(CompanyService);

      jest.spyOn(service.registerForm, 'valid', 'get').mockReturnValue(true);

      service.validateCompany().subscribe((result) => {
        expect(result.success).toBe(true);
        const { emailConfirm, ...expected } = service.registerForm.value;
        expect(companyService.validateCompany).toHaveBeenCalledWith(expected);
        done();
      });
    });

    it('should return success false if form is invalid', (done) => {
      const fixture = MockRender(AffiliationService);
      const service = fixture.point.componentInstance;
      const companyService = ngMocks.findInstance(CompanyService);
      (companyService.validateCompany as jest.Mock).mockReturnValue(
        of({ success: false }),
      );

      jest.spyOn(service.registerForm, 'valid', 'get').mockReturnValue(false);

      service.validateCompany().subscribe((result) => {
        expect(result.success).toBe(false);
        expect(companyService.validateCompany).toHaveBeenCalled();
        done();
      });
    });

    it('should handle error from validateCompany', (done) => {
      const fixture = MockRender(AffiliationService);
      const service = fixture.point.componentInstance;
      const companyService = ngMocks.findInstance(CompanyService);

      jest.spyOn(service.registerForm, 'valid', 'get').mockReturnValue(true);
      (companyService.validateCompany as jest.Mock).mockReturnValue(
        throwError(() => new Error('Error')),
      );

      service.validateCompany().subscribe({
        next: () => {
          done.fail('Expected an error, but received a value.');
        },
        error: (err) => {
          expect(err).toBeInstanceOf(Error);
          const { emailConfirm, ...expected } = service.registerForm.value;
          expect(companyService.validateCompany).toHaveBeenCalledWith(expected);
          done();
        },
      });
    });
  });
});
