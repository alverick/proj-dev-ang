import { Injectable, EventEmitter } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class PagoService {
  public closeAll = new EventEmitter<void>();


}
