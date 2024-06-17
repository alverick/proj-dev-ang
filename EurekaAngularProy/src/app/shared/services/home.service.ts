import { type HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { type Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { type IServiceRemoteModel } from '../models';
import { type CompanyServices } from '../models/company';
import { type DateList } from '../models/dateList';
import { type Debts } from '../models/debts';
import { type Type } from '../models/type';
import { type WayPay } from '../models/way-pay';

@Injectable()
export class HomeService {
  constructor(private http: HttpClient) {}

  private ListDebts: Debts[] = [];

  private type: Type[] = [
    { idType: '', descripcion: 'Servicio' },
    /* {idType: 'Pension', descripcion: 'Pensión'},
    {idType: 'Matricula', descripcion: 'Matricula'}*/
  ];

  private wayPay: WayPay[] = [
    { idWayPay: 'PENDIENTE', descripcion: 'Pendiente' },
    { idWayPay: 'PAGADO', descripcion: 'Pagado' },
    { idWayPay: 'PARCIAL', descripcion: 'Parcial' },
    { idWayPay: 'VENCIDO', descripcion: 'Vencido' },
    { idWayPay: 'HABILITADO', descripcion: 'Habilitado' },
    { idWayPay: 'DESHABILITADO', descripcion: 'Deshabilitado' },
  ];

  private date: DateList[] = [
    { idDate: 'EmissionDate', descripcion: 'Emisión' },
    { idDate: 'DueDate', descripcion: 'Vencimiento' },
    { idDate: 'PaymentDate', descripcion: 'Pago' },
  ];

  public SERVICES: string[] = ['Matricula', 'Pension'];

  getDebts(): Observable<Debts[]> {
    return of(this.ListDebts);
  }

  getType(): Observable<Type[]> {
    return of(this.type);
  }

  getWayPay(): Observable<WayPay[]> {
    return of(this.wayPay);
  }

  getDate(): Observable<DateList[]> {
    return of(this.date);
  }

  getServices(incDeactivates: boolean = false) {
    const url = `${
      environment.END_POINT
    }/company/service?incDeactivates=${incDeactivates.toString()}`;
    return this.http
      .get<IServiceRemoteModel[]>(url)
      .pipe(
        map((r) => {
          const data: Partial<IServiceRemoteModel>[] = [];
          r.forEach((s) =>
            data.push({
              id: s.id,
              name: s.name,
              dataType: s.dataType,
            })
          );
          return data;
        })
      )
      .pipe(catchError((err: HttpErrorResponse) => throwError(() => err)));
  }

  getServicesActive(serviceWithoutData = true) {
    const url = `${
      environment.END_POINT
    }/company/service/active/${serviceWithoutData.toString()}`;
    return this.http
      .get<CompanyServices[]>(url)
      .pipe(
        map((r) => {
          const data: Partial<CompanyServices>[] = [];
          r.forEach(({ dataType, id, name, currencySymbol }) => {
            if (name !== '') {
              data.push({
                id,
                name,
                dataType,
                currencySymbol,
              });
            }
          });
          return data;
        })
      )
      .pipe(catchError((err: HttpErrorResponse) => throwError(() => err)));
  }

  getDebtorCode(service: string, code: string) {
    const url = `${environment.END_POINT}/debt/service/${service}/debtor/${code}`;
    return this.http
      .get<any>(url)
      .pipe(catchError((err: HttpErrorResponse) => throwError(() => err)));
  }

  postNewDebt(service: string, data: any) {
    const url = `${environment.END_POINT}/debt/service/${service}/debtor`;
    return this.http
      .post<any>(url, data)
      .pipe(catchError((err: HttpErrorResponse) => throwError(() => err)));
  }
}
