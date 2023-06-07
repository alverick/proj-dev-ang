import { Injectable } from '@angular/core';
import {
  ApiMockResponseCallback,
  ApiMockRootRoute,
  ApiMockService,
} from '@ng-stack/api-mock';

import { environment } from '../environments/environment';
import { updateCompanyMock } from './shared/mocks/affiliation';

@Injectable({
  providedIn: 'root',
})
export class MockService implements ApiMockService {
  getRoutes(): ApiMockRootRoute[] {
    return [
      {
        host: environment.END_POINT,
        path: 'company',
        responseCallback: this.validate(),
      },
      {
        host: environment.END_POINT,
        path: 'company/validate',
        responseCallback: this.validate(),
      },
      {
        host: environment.END_POINT,
        path: 'company/service',
        responseCallback: this.validate(),
      },
      {
        host: environment.END_POINT,
        path: 'company/3000/cards',
        responseCallback: () => [
          {
            id: '8180',
            number: '*********8180 ( CTA CTE PERSONA JURIDICA - Soles)',
            currency: '001',
          },
          {
            id: '8181',
            number: '*********8181 ( CTA CTE PERSONA - Soles)',
            currency: '001',
          },
        ],
      },
      {
        host: environment.END_POINT,
        path: 'company/cards',
        responseCallback: () => [
          {
            id: '8180',
            number: '*********8180 ( CTA CTE PERSONA JURIDICA - Soles)',
            currency: '001',
          },
        ],
      },
      {
        host: environment.END_POINT,
        path: 'company/gtp/client/update',
        responseCallback: () => true,
      },
      {
        host: environment.END_POINT,
        path: 'Login/dencrypt',
        responseCallback: () => updateCompanyMock,
      },
    ];
  }
  private validate(): ApiMockResponseCallback {
    return () => ({
      id: 3000,
      success: true,
      code: 1,
      message: 'El Ruc ya se encuentra registrado',
    });
  }
}
