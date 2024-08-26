import { Injectable } from '@angular/core';
import {
  type ApiMockResponseCallback,
  type ApiMockRootRoute,
  type ApiMockService,
} from '@ng-stack/api-mock';

import { environment } from '../environments/environment';
import { getAffiliate } from './shared/mocks/company';
import { type ICompanyData } from './shared/models/company-data';
import { type IDataEnterpriseModel } from './shared/models/data-enterprise.model';

@Injectable()
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
        responseCallback: () => ({
          id: 3000,
          success: true,
          code: 1,
          message: 'El Ruc ya se encuentra registrado',
          tradeName: 'Nombre empresa trade',
          fullName: 'Nombre empresa full',
        }),
      },
      {
        host: environment.END_POINT,
        path: 'company/service',
        responseCallback: this.validate(),
      },
      {
        host: environment.END_POINT,
        path: 'company/getafiliate',
        responseCallback: () => getAffiliate,
      },
      {
        host: environment.END_POINT,
        path: 'company/GTP/client/3581',
        responseCallback: (): Partial<ICompanyData> => ({
          ruc: '20393206498',
          name: 'EMPR ANGULAR150',
          entry: '14',
          entryName: 'Rubro de prueba',
          email: 'CORREOPRUEBAQA2@outlook.es',
          movilNumber: '945580923',
          movilOperator: 'M',
          newName: 'EMPR ANGULAR150',
          newNameGTPStatus: 1,
          uniqueCodeIBK: '00000060611123',
          requestDate: '2024-02-07T17:43:14.5366667',
          inReview: false,
          enabled: false,
          isNewEnterprise: false,
          useAgencyChannel: false,
        }),
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
        responseCallback: () => ({
          id: 0,
          ruc: '202023482328',
          name: 'Nombre Empresa',
          newNameGTPStatus: 1,
          entry: '31',
          email: 'correo@correo.com',
          movilNumber: '98333333',
          movilOperator: 'Movistar',
          newName: 'Nombre empresa mod',
          status: 'string',
          uniqueCodeIBK: '2122',
          requestDate: '2023-11-30T15:11:36.618Z',
          inReview: true,
          arrayServices: [
            {
              id: 23,
              res: '234333',
              name: 'Servicio 1',
              debtorCode: 'DNI',
              dataType: 'S',
              paymentType: 'string',
              idAccount: '4234234234234234',
              accountNumber: '324234234234',
              currency: 'string',
              useAppWeb: true,
              useAgent: true,
              useStore: true,
              partialPayment: 'string',
              chargeInterest: 'string',
              chargeType: 0,
              interestType: 'string',
              amount: 0,
              percentage: 0,
              currencySymbol: 'S/',
              inReview: true,
              newNameCode: 'Codigo',
              newNameCodeGTPStatus: 3,
              newName: 'Servicio 1 mod',
              newNameGTPStatus: 3,
              status: 'string',
              debtorCodeType: 0,
              useAgencyChannel: true,
            },
          ],
          UseAgencyChannel: true,
        }),
      },
      {
        host: environment.END_POINT,
        path: 'debt/load/DATA%20COMPLETA',
        responseCallback: () => ({
          id: 314,
        }),
      },
      {
        host: environment.END_POINT,
        path: 'debt/process/last1',
        responseCallback: () => ({
          id: 325,
          status: 'VALIDATING',
          phase: 2,
          advance: 0.0,
        }),
      },
      {
        host: environment.END_POINT,
        path: 'debt/process/325/status1',
        responseCallback: () => ({
          status: 'VALIDATING',
          errors: [],
          rowsUploaded: -4,
          rowsRejected: 2,
          advance: 0,
          phase: 3,
        }),
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
