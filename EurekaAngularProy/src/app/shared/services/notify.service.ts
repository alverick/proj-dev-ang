import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  faBell as farBell,
  faCircle as farCircle,
} from '@fortawesome/free-regular-svg-icons';
import { faCircle as fasCircle } from '@fortawesome/free-solid-svg-icons';
import { timer } from 'rxjs';
import 'rxjs/add/observable/of';
import { Subject } from 'rxjs/internal/Subject';
import { delayWhen, repeat, takeUntil } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { StorageService } from './storage.service';

const timeCallNotify = 60000;

const markAsRead = 'Marcar como leído';
const markAsNotRead = 'Marcar como no leído';

@Injectable()
export class NotifyService {
  constructor(private http: HttpClient, private storage: StorageService) {}

  inExecution = false;
  icono: any = farBell;
  loadingMsg = false;

  existMore = true;
  messages: any[] = [];
  total = -1;

  public iniciar() {
    this.storage.getCurrentSession();

    if (!this.storage.isValidSession()) {
      return;
    }
    const stop = new Subject();

    const setDelay = () =>
      this.inExecution ? timer(timeCallNotify) : timer(2000);

    this.http
      .get(
        `${environment.END_POINT}/notification/total?_=${new Date().getTime()}`
      )
      .pipe(delayWhen(setDelay), repeat(), takeUntil(stop))
      .subscribe(
        ({ total }: any) => {
          this.inExecution = true;
          if (total !== this.total) {
            this.total = total;
            this.messages = [];
            this.existMore = true;
            this.loadMsgs();
          }
        },
        (error) => {
          this.inExecution = true;
          if (error.status === 401) {
            stop.next(true);
          }
        }
      );
  }

  public clear() {
    this.messages = [];
    this.total = -1;
  }

  public loadMsgs() {
    if (this.existMore && !this.loadingMsg) {
      this.loadingMsg = true;
      this.http
        .get<any>(
          `${environment.END_POINT}/notification?skip=${
            this.messages.length
          }&_=${new Date().getTime()}`
        )
        .subscribe(
          (d) => {
            this.loadingMsg = false;
            if (d.length < 15) {
              this.existMore = false;
            }
            d.forEach((s) => {
              s.icono = s.isNew ? farCircle : fasCircle;
              s.title = s.isNew ? markAsRead : markAsNotRead;
              this.messages.push(s);
            });
          },
          () => {
            this.loadingMsg = false;
          }
        );
    }
  }

  public changeRead(msg: any) {
    this.http.post(
      `${environment.END_POINT}/notification/mark/${
        msg.id
      }?_=${new Date().getTime()}`,
      {}
    );
    msg.isNew = !msg.isNew;
    if (msg.isNew) {
      msg.icono = farCircle;
      msg.title = markAsRead;
    } else {
      msg.icono = fasCircle;
      msg.title = markAsNotRead;
    }
  }

  public markAll() {
    this.http
      .post(
        `${environment.END_POINT}/notification/mark?_=${new Date().getTime()}`,
        {}
      )
      .subscribe(() => {
        this.total = -1;
      });
  }
}
