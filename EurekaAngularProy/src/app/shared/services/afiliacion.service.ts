import { type HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { type Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import {
  type IEntryModel,
  type IServiceModel,
  type MonedaModel,
} from '../models';

@Injectable()
export class AfiliacionService {
  constructor(private http: HttpClient) {}

  public idCompany = 0;
  public email: string;
  public Guardado = false;

  public services: IServiceModel[] = [];
  private _rubros: IEntryModel[] = null;

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
        })
      )
      .pipe(catchError((err: HttpErrorResponse) => throwError(() => err)));
  }

  public GetRubrosAll(): Observable<IEntryModel[]> {
    return this.http
      .get<IEntryModel[]>(`${environment.END_POINT}/enterpriseHeading/all`)
      .pipe(catchError((err: HttpErrorResponse) => throwError(() => err)));
  }

  public GetCodDeudor(): Observable<any[]> {
    return of<any[]>([
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
    ]);
  }

  public GetTipoDato(): Observable<any[]> {
    return of<any[]>([
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
    ]);
  }

  public GetTipoPago(): Observable<any[]> {
    return of<any[]>([
      {
        code: 'C',
        name: 'Pueden elegir qué deuda quieren pagar',
      },
      {
        code: 'P',
        name: 'Siempre la deuda que vence primero',
      },
    ]);
  }

  public GetMoneda(): Observable<MonedaModel[]> {
    return of<MonedaModel[]>([
      {
        code: '001',
        name: 'Soles',
        symbol: 'S/',
      },
      {
        code: '002',
        name: 'Dólares',
        symbol: '$',
      },
    ]);
  }

  public GetPeriodoMora(): Observable<any[]> {
    return of<any[]>([
      {
        code: '1',
        name: 'Diario',
      },
      {
        code: '2',
        name: 'Fijo',
      },
    ]);
  }

  public GetCards(): Observable<any[]> {
    if (this.idCompany) {
      return this.http.get<any[]>(
        `${environment.END_POINT}/company/${this.idCompany}/cards`
      );
    }
    return this.http.get<any[]>(`${environment.END_POINT}/company/cards`);
  }

  Descartar(indice: number, isNew: boolean) {
    this.Guardado = false;
    if (
      isNew &&
      this.services.length > 1 &&
      indice >= 0 &&
      indice === this.services.length - 1
    ) {
      const svc = this.services[this.services.length - 1];
      if (svc.id === null || svc.id === undefined || svc.id < 0) {
        this.services.pop();
      }
    }
  }
}
