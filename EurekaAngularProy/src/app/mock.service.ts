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

@Injectable({
  providedIn: 'root',
})
export class MockService implements ApiMockService {
  counter = 1;
  getRoutes(): ApiMockRootRoute[] {
    return [
      {
        host: environment.END_POINT,
        path: 'company1',
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
        path: 'company/service1',
        responseCallback: this.validate(),
      },
      {
        host: environment.END_POINT,
        path: 'company/getafiliate1',
        responseCallback: () => getAffiliate,
      },
      {
        host: environment.END_POINT,
        path: 'company/GTP/client/1891',
        responseCallback: (): Partial<ICompanyData> => ({
          ruc: '10715816526',
          name: 'INVERSIONES ARIFER',
          entry: '12',
          entryName: 'SEGURO U OTRO',
          email: 'correocontrol5@gmail.com',
          movilNumber: '997170800',
          movilOperator: 'C',
          newName: 'INVERSIONES ADRIFER',
          newNameGTPStatus: 3,
          uniqueCodeIBK: '00000013302133',
          requestDate: '2024-02-02T19:36:34.0166667',
          inReview: false,
          enabled: false,
          isNewEnterprise: false,
          useAgencyChannel: false,
        }),
      },
      {
        host: environment.END_POINT,
        path: 'company/GTP/accountStateDetails/1891',
        responseCallback: () => ({
          accountStateDetailsResponse: {
            requestDate: '02/02/2024 07:36 PM',
            approbationDate: '02/02/2024 07:36 PM',
            lastAccess: '14/03/2024 12:37 PM',
          },
        }),
      },
      {
        host: environment.END_POINT,
        path: 'company/1891/cards',
        responseCallback: () => [
          {
            id: '0927',
            number: '*********0927 ( CTA.NEGOCIOS PNN - Soles)',
            currency: '001',
          },
        ],
      },
      {
        host: environment.END_POINT,
        path: 'company/GTP/services/1891/false',
        responseCallback: () => [
          {
            id: 17923,
            res: '',
            name: null,
            debtorCode: null,
            dataType: 'S',
            paymentType: 'C',
            idAccount: '0927',
            accountNumber: '*********0927 (Soles)',
            currency: '001',
            useAppWeb: true,
            useAgent: false,
            useStore: false,
            partialPayment: 'N',
            chargeInterest: 'N',
            chargeType: 1,
            interestType: 'M',
            amount: 1,
            percentage: null,
            currencySymbol: 'S/',
            inReview: true,
            newNameCode: 'CODIGO',
            newNameCodeGTPStatus: 0,
            newName: 'SERVICIOS GENERALES',
            newNameGTPStatus: 0,
            status: 'EnRevision',
            debtorCodeType: 0,
            useAgencyChannel: false,
          },
          {
            id: 18028,
            res: '',
            name: null,
            debtorCode: null,
            dataType: 'P',
            paymentType: 'C',
            idAccount: '0927',
            accountNumber: '*********0927 (Soles)',
            currency: '001',
            useAppWeb: true,
            useAgent: false,
            useStore: false,
            partialPayment: 'N',
            chargeInterest: 'N',
            chargeType: 1,
            interestType: 'M',
            amount: 1,
            percentage: null,
            currencySymbol: 'S/',
            inReview: true,
            newNameCode: 'CODIGO',
            newNameCodeGTPStatus: 0,
            newName: 'ASESORA FINANCIERA',
            newNameGTPStatus: 0,
            status: 'EnRevision',
            debtorCodeType: 0,
            useAgencyChannel: false,
          },
        ],
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
        path: 'company/cards1',
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
        path: 'login1',
        responseCallback: () => ({
          respuestaHttp: 204,
          codRespuesta: 4,
          estado: false,
          paramStr: 'Credenciales inválidas',
          rfs: null,
          exp: null,
          paramNum: 3,
          prfl: null,
        }),
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
        responseCallback: () => {
          console.log(this.counter++);
          if (this.counter === 10) {
            return {
              status: 'REJECTED',
              errors: [
                {
                  code: 0,
                  row: 2,
                  description:
                    'El nombre del Servicio no es el que corresponde, debe ser Servicio usuario nuevo',
                  field: 'Name Service',
                  value: null,
                },
              ],
              rowsUploaded: 0,
              rowsRejected: 1,
              advance: 0.0,
              phase: 3,
            };
          }
          return {
            status: 'VALIDATING',
            errors: [],
            rowsUploaded: -4,
            rowsRejected: 2,
            advance: 0,
            phase: 3,
          };
        },
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
