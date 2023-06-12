import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { DateList } from 'src/app/shared/models/dateList';
import { environment } from 'src/environments/environment';

import { Debts } from '../models/debts';
import { Type } from '../models/type';
import { WayPay } from '../models/way-pay';

@Injectable({
  providedIn: 'root',
})
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

  getServices(incDeactivates: boolean = false): Observable<any[]> {
    const url = `${environment.END_POINT}/company/service?incDeactivates=${incDeactivates}`;
    return this.http
      .get<any[]>(url)
      .pipe(
        map((r) => {
          const data: any[] = [];
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
      .pipe(catchError((err) => throwError(err)));
  }

  getServicesActive(serviceWithoutData: boolean = true): Observable<any[]> {
    const url = `${environment.END_POINT}/company/service/active/${serviceWithoutData}`;
    return this.http
      .get<any[]>(url)
      .pipe(
        map((r) => {
          const data: any[] = [];
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
      .pipe(catchError((err) => throwError(err)));
  }

  getDebtorCode(service: string, code: string): Observable<any> {
    const url = `${environment.END_POINT}/debt/service/${service}/debtor/${code}`;
    return this.http.get<any>(url).pipe(catchError((err) => throwError(err)));
  }

  postNewDebt(service: string, data: any): Observable<any> {
    const url = `${environment.END_POINT}/debt/service/${service}/debtor`;
    return this.http
      .post<any>(url, data)
      .pipe(catchError((err) => throwError(err)));
  }
}
