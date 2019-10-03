import { Injectable } from '@angular/core';
import { Observable, throwError, of } from "rxjs";
import { Debts } from '../models/debts';
import { Type } from '../models/type';
import { WayPay } from '../models/way-pay';
import { Date } from 'src/app/shared/models/date';
import { environment } from 'src/environments/environment';
import { catchError, map } from "rxjs/operators";
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class HomeService {
  constructor(private http: HttpClient){}

  private ListDebts: Debts[] = [];

  private type: Type[] = [
    { idType: '', descripcion: 'Servicio' },
   /* {idType: 'Pension', descripcion: 'Pensión'},
    {idType: 'Matricula', descripcion: 'Matricula'}*/
  ];

  private wayPay: WayPay[] = [
    {idWayPay: 'PENDIENTE', descripcion: 'Pendiente'},
    {idWayPay: 'PAGADO', descripcion: 'Pagado'},
    {idWayPay: 'PARCIAL', descripcion: 'Parcial'},
    {idWayPay: 'VENCIDO', descripcion: 'Vencido'},
  ];

  private date:  Date[] = [
    {idDate: 'EmissionDate', descripcion: 'Emisión'},
    {idDate: 'DueDate', descripcion: 'Vencimiento'}
  ];


public SERVICES: string[]=[
   'Matricula', 'Pension'
];

getDebts(): Observable<Debts[]> {
    return of(this.ListDebts);
}

getType(): Observable<Type[]> {
  return of(this.type);
}

getWayPay(): Observable<WayPay[]> {
  return of(this.wayPay);
}

getDate(): Observable<Date[]> {
  return of(this.date);
}

getServices(incDeactivates: boolean = false): Observable<any[]> {
  const url =`${environment.END_POINT}/company/service?incDeactivates=${incDeactivates}&_=`+ new Date().getTime();;
  return this.http.get<any[]> (url)
    .pipe(map(r => {
      let data: any[] = [];
      r.forEach(s => data.push({
        id: s.id,
        name: s.name
      }));
      return data;
    }))
    .pipe(catchError(err => throwError(err)));

}

getServicesActive(): Observable<any[]> {
  const url =`${environment.END_POINT}/company/service/active?_=`+ new Date().getTime();;
  return this.http.get<any[]> (url)
    .pipe(map(r => {
      let data: any[] = [];
      r.forEach(s => data.push({
        id: s.id,
        name: s.name
      }));
      return data;
    }))
    .pipe(catchError(err => throwError(err)));

}

}
