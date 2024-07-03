import { type HttpErrorResponse, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  type IconDefinition,
  faBell as farBell,
  faCircle as farCircle,
} from '@fortawesome/free-regular-svg-icons';
import { faCircle as fasCircle } from '@fortawesome/free-solid-svg-icons';
import { Subject, timer } from 'rxjs';
import { delayWhen, repeat, takeUntil } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';

const timeCallNotify = 60000;

const markAsRead = 'Marcar como leído';
const markAsNotRead = 'Marcar como no leído';

export interface MessagesResponse {
  create: string;
  id: number;
  isNew: boolean;
  message: string;
}

export interface MessagesType extends MessagesResponse {
  icono: IconDefinition;
  title: string;
}

@Injectable()
export class NotifyService {
  set total(value: number) {
    this._total = value;
    if (value >= 100) {
      this.totalLabel = '99+';
    } else {
      this.totalLabel = value.toString(10);
    }
  }
  get total() {
    return this._total;
  }
  constructor(private http: HttpClient, private storage: StorageService) {}

  inExecution = false;
  icono: any = farBell;
  loadingMsg = false;

  existMore = true;
  messages: MessagesType[] = [];
  private _total = -1;
  totalLabel = '';

  public iniciar() {
    this.storage.getCurrentSession();

    if (!this.storage.isValidSession()) {
      return;
    }
    const stop = new Subject();

    const setDelay = () =>
      this.inExecution ? timer(timeCallNotify) : timer(2000);

    this.http
      .get(`${environment.END_POINT}/notification/total`)
      .pipe(delayWhen(setDelay), repeat(), takeUntil(stop))
      .subscribe({
        next: ({ total }: { total: number }) => {
          this.inExecution = true;
          if (total !== this.total) {
            this.total = total;
            this.messages = [];
            this.existMore = true;
            this.loadMessages();
          }
        },
        error: (error: HttpErrorResponse) => {
          this.inExecution = true;
          if (error.status === 401) {
            stop.next(true);
          }
        },
      });
  }

  public clear() {
    this.messages = [];
    this.total = -1;
  }

  public loadMessages() {
    if (this.existMore && !this.loadingMsg) {
      this.loadingMsg = true;
      this.http
        .get<MessagesResponse[]>(
          `${environment.END_POINT}/notification?skip=${this.messages.length}`
        )
        .subscribe({
          next: (d) => {
            this.loadingMsg = false;
            if (d.length < 15) {
              this.existMore = false;
            }
            d.forEach((s) => {
              this.messages.push({
                ...s,
                icono: s.isNew ? farCircle : fasCircle,
                title: s.isNew ? markAsRead : markAsNotRead,
              });
            });
          },
          error: () => {
            this.loadingMsg = false;
          },
        });
    }
  }

  public changeRead(msg: MessagesType) {
    this.http.post(`${environment.END_POINT}/notification/mark/${msg.id}`, {});
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
      .post(`${environment.END_POINT}/notification/mark`, {})
      .subscribe(() => {
        this.total = -1;
      });
  }
}
