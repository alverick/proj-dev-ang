import { HttpClient, type HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { type Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { type IEntryModel, type IServiceModel } from '../models';
import { CompanyAccounts } from './company.service';

@Injectable()
export class AfiliacionService {
  private readonly http = inject(HttpClient);

  public idCompany = 0;
  public email: string;

  public services: IServiceModel[] = [];
  private _rubros: IEntryModel[] = null;
  public codDeudor: IEntryModel[] = [
    {
      code: 'DNI',
      name: 'DNI',
    },
    {
      code: 'RUC',
      name: 'RUC',
    },
    {
      code: 'Codigo Interno',
      name: 'Celular',
    },
    {
      code: 'Otro',
      name: 'Otro (Cód. Interno, Cod. Alumno, N° de departamentos, etc.)',
    },
  ];
  public tipoDato: IEntryModel[] = [
    {
      code: 'C',
      name: 'Tengo su código, nombres y deuda',
    },
    {
      code: 'P',
      name: 'Tengo solo código y nombres',
    },
    {
      code: 'S',
      name: 'No ingresaré data',
    },
  ];
  public tipoPago: IEntryModel[] = [
    {
      code: 'C',
      name: 'Pueden elegir qué deuda quieren pagar',
    },
    {
      code: 'P',
      name: 'Siempre la deuda que vence primero',
    },
  ];
  public periodoMora: IEntryModel[] = [
    {
      code: '1',
      name: 'Diario',
    },
    {
      code: '2',
      name: 'Fijo',
    },
  ];

  public GetRubros(): Observable<IEntryModel[]> {
    if (this._rubros !== null) {
      return of(this._rubros);
    }
    return this.http
      .get<IEntryModel[]>(`${environment.END_POINT}/enterpriseHeading`)
      .pipe(
        map((r) => {
          this._rubros = r;
          return r;
        }),
      )
      .pipe(catchError((err: HttpErrorResponse) => throwError(() => err)));
  }

  public GetCards() {
    if (this.idCompany) {
      return this.http.get<CompanyAccounts[]>(
        `${environment.END_POINT}/company/${this.idCompany}/cards`,
      );
    }
    return this.http.get<CompanyAccounts[]>(
      `${environment.END_POINT}/company/cards`,
    );
  }
}
