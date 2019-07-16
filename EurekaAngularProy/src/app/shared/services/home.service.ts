import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Debts } from '../models/debts';
import { Type } from '../models/type';
import { WayPay } from '../models/way-pay';
import { Date } from 'src/app/shared/models/date';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private ListDebts: Debts[] = []; 

  private type: Type[] = [
    { idType: '', descripcion: 'Servicio' },
    {idType: 'Pension', descripcion: 'Pensión'},
    {idType: 'Matricula', descripcion: 'Matricula'}
  ];

  private wayPay: WayPay[] = [
    {idWayPay: '', descripcion: 'Estado de Pago'},
    {idWayPay: 'PENDING', descripcion: 'Pendiente de Pago'},
    {idWayPay: 'PAID', descripcion: 'Pagado'},
  ];

  private date:  Date[] = [
    {idDate: '', descripcion: 'Por fecha'},
    {idDate: 'EmissionDate', descripcion: 'Fecha de emisión'},
    {idDate: 'dueDate', descripcion: 'Fecha de pago'},
  ];

  /*
  private type: string[]=[
    'Pensión', 'Matricula'
  ]
  
  private wayPay: string []=[
    'Estado de Pago', 'Pendiente de Pago', 'Pagado'
  ]

  private date: string []=[
    'Por fecha', 'Fecha de emisión',  'Fecha de emisión', 'Fecha de pago'
  ];
*/

public SERVICES: string[]=[
  'servicio', 'Matrícula', 'Pension'
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

getServices(): Observable<String[]>{
  return of(this.SERVICES);
}


  constructor() { }
}
