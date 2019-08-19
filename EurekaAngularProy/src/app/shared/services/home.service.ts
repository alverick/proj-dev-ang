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
    {idWayPay: '', descripcion: 'Estado de Pago'},
    {idWayPay: 'PENDING', descripcion: 'Pendiente de Pago'},
    {idWayPay: 'PAID', descripcion: 'Pagado'},
  ];

  private date:  Date[] = [
    {idDate: '', descripcion: 'Por fecha'},
    {idDate: 'EmissionDate', descripcion: 'Fecha de emisión'}, 
    {idDate: 'DueDate', descripcion: 'Fecha de vencimiento'}
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

getServices(): Observable<any[]> {
  return this.http.get<any[]> (`${environment.END_POINT}/company/service`)
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
