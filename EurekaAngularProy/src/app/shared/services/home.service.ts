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

  private ListDebts: Debts[] = [
    {
      id_debt: 1,
      status: 'status1', 
      currency: 'dolar',
      quota_code:'quota_code 1',
      operation_mod: 'operation_mod 1',
      amount_init: 'amount_init1',
      amount_balance: 'amount_balance1',
      interest_amount: 'interest_amount1',
      emission_date: 'emission_date1',
      due_date: 'due_date1',
      document_number: 'document_number1'    
    },
    {
      id_debt: 2, 
      status: 'status2',
      currency: 'soles',
      quota_code:'quota_code 2',
      operation_mod: 'operation_mod2',
      amount_init: 'amount_init2',
      amount_balance: 'amount_balance2',
      interest_amount: 'interest_amount2', 
      emission_date: 'emission_date2',
      due_date: 'due_date2',
      document_number: 'document_number2' 
    },
  ]; 

  private type: Type[] = [
    {idType: 1, descripcion: 'Pensión'},
    {idType: 2, descripcion: 'Matricula'}
  ];

  private wayPay: WayPay[] = [
    {idWayPay: 1, descripcion: 'Estado de Pago'},
    {idWayPay: 2, descripcion: 'Pendiente de Pago'},
    {idWayPay: 3, descripcion: 'Pagado'},
  ];

  private date:  Date[] = [
    {idDate: 1, descripcion: 'Por fecha'},
    {idDate: 2, descripcion: 'Fecha de emisión'},
    {idDate: 3, descripcion: 'Fecha de pago'},
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
