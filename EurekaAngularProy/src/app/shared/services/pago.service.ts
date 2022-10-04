import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class PagoService {
  public closeAll = new EventEmitter<void>();
}
