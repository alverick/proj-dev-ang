import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http'; 
import { Injectable } from '@angular/core';
import { StatesGtp } from '../models/states-gtp';

@Injectable({
  providedIn: 'root'
})
export class GtpService {

  constructor(private http: HttpClient) { }

  private States:StatesGtp [] =[
    {idState: 'pendiente', descripcion:'pendiente'},
    {idState: 'resuelto ', descripcion:'resuelto '},
    {idState: 'devuelto', descripcion:'devuelto'},
  ];


  getStates(): Observable<StatesGtp[]>{
    return of(this.States);
  } 

}
