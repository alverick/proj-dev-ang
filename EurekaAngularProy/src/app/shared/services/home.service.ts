import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private type: string[]=[
    'Pensión', 'Matricula'
  ]
  
  private wayPay: string []=[
    'Estado de Pago', 'Pendiente de Pago', 'Pagado'
  ]

  private date: string []=[
    'Por fecha', 'Fecha de emisión',  'Fecha de emisión', 'Fecha de pago'
  ]



  getType(): Observable<String[]>{
    return of(this.type);
  }  

  getWayPay(): Observable<String[]>{
    return of(this.wayPay);
  }
  
  getDate(): Observable<String[]>{
    return of(this.date);
  }


  constructor() { }
}
