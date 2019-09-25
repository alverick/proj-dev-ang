import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { map, delay } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { faBell as fasBell, faCircle as fasCircle } from '@fortawesome/free-solid-svg-icons';
import { faBell as farBell, faCircle as farCircle } from '@fortawesome/free-regular-svg-icons';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';

@Injectable()
export class NotifyService {
  constructor(private http: HttpClient, private storage: StorageService) { }

  inExecution: boolean = false;
  icono: any = farBell;
  loadingMsg: boolean = false;

  existMore: boolean = true;
  messages: any[] = [];
  total: number = -1;

  public iniciar() {
    if (!this.inExecution) {
      this.inExecution = true;
      const callNotify = () => {
        if (this.storage.isAuthenticated()) {
          this.http.get(`${environment.END_POINT}/notification/total?_=${new Date().getTime()}`)
            .subscribe((d: any) => {
              this.inExecution = false;
              if (d.total !== this.total) {
                this.total = d.total;
                this.messages = [];
                this.existMore = true;
                this.loadMsgs();
              }
              Observable.of({}).pipe(delay(5000)).subscribe(() => callNotify());
            });
        }
      };
      Observable.of({}).pipe(delay(1000)).subscribe(() => callNotify());
    }
  }

  public loadMsgs() {
    if (this.existMore && !this.loadingMsg) {
      this.loadingMsg = true;
      this.http.get<any>(`${environment.END_POINT}/notification?skip=${this.messages.length}&_=${new Date().getTime()}`)
        .subscribe(d => {
          this.loadingMsg = false;
          if (d.length < 15) {
            this.existMore = false;
          }
          d.forEach(s => {
            s.icono = s.isNew ? farCircle : fasCircle;
            s.title = s.isNew ? 'Marcar como leido' : 'Marcar como no leido';
            this.messages.push(s);
          });
        }, err => { this.loadingMsg = false; });
    }
  }

  public changeRead(msg: any) {
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

  public markAll() {
    this.http.post(`${environment.END_POINT}/notification/mark?_=${new Date().getTime()}`, {})
      .subscribe(() => { });
  }
}
