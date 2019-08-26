import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import { Injectable } from "@angular/core";
import { faBell as fasBell, faCircle as fasCircle } from '@fortawesome/free-solid-svg-icons';
import { faBell as farBell, faCircle as farCircle } from '@fortawesome/free-regular-svg-icons';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {
  constructor(private http: HttpClient) { }

  icono: any = farBell;

  existMore: boolean = true;
  messages: any[] = [];
  total: number = -1;

  public iniciar() {
    var callNotify = () => {
      this.http.get<any>(`${environment.END_POINT}/notification/total?_=${new Date().getTime()}`)
        .subscribe(d => {
          this.icono = (d.total > 0 ? fasBell : farBell);
          if (d.total !== this.total) {
            this.total = d.total;
            this.messages = [];
            this.loadMsgs();
          }
        })
    };
    Observable.interval(10000).subscribe(() => callNotify());
    callNotify();
  }

  public loadMsgs() {
    if (this.existMore) {
      this.http.get<any[]>(`${environment.END_POINT}/notification?skip=${this.messages.length}&_=${new Date().getTime()}`)
        .subscribe(d => {
          if (d.length < 15) {
            this.existMore = false;
          }
          d.forEach(s => {
            s.icono = s.isNew ? farCircle : fasCircle;
            s.title = s.isNew ? 'Marcar como leido' : 'Marcar como no leido';
            this.messages.push(s);
          });
        });
    }
  }

  public changeRead(msg: any) {
    console.log('change read');
    this.http.put(`${environment.END_POINT}/notification/mark/${msg.id}?_=${new Date().getTime()}`, {})
      .subscribe(() => { });
    msg.isNew = !msg.isNew;
    if (msg.isNew) {
      msg.icono = farCircle;
      msg.title = 'Marcar como leido';
    } else {
      msg.icono = fasCircle;
      msg.title = 'Marcar como no leido';
    }
  }
}
