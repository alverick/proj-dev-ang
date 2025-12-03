import { HttpClient, type HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  faBell as farBell,
  faCircle as farCircle,
  type IconDefinition,
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
  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageService);

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

  inExecution = false;
  icono: any = farBell;
  loadingMsg = false;

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
      .get<{ total: number }>(`${environment.END_POINT}/notification/total`)
      .pipe(delayWhen(setDelay), repeat(), takeUntil(stop))
      .subscribe({
        next: ({ total }) => {
          this.inExecution = true;
          if (total !== this.total) {
            this.total = total;
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
    if (!this.loadingMsg) {
      this.loadingMsg = true;
      this.http
        .get<
          MessagesResponse[]
        >(`${environment.END_POINT}/notification?skip=${this.messages.length}`)
        .subscribe({
          next: (d) => {
            setTimeout(() => {
              this.loadingMsg = false;
              d.forEach((s) => {
                this.messages.push({
                  ...s,
                  icono: s.isNew ? farCircle : fasCircle,
                  title: s.isNew ? markAsRead : markAsNotRead,
                });
              });
              this.messages.sort((a, b) => {
                return (
                  new Date(b.create).getTime() - new Date(a.create).getTime()
                );
              });
            }, 1000);
          },
          error: () => {
            this.loadingMsg = false;
          },
        });
    }
  }

  public changeRead(msg: MessagesType) {
    this.http
      .post(`${environment.END_POINT}/notification/mark/${msg.id}`, {})
      .subscribe({
        next: () => {
          msg.isNew = !msg.isNew;
          if (msg.isNew) {
            msg.icono = farCircle;
            msg.title = markAsRead;
          } else {
            msg.icono = fasCircle;
            msg.title = markAsNotRead;
          }
        },
      });
  }

  public markAll() {
    this.http
      .post(`${environment.END_POINT}/notification/mark`, {})
      .subscribe(() => {
        this.total = -1;
      });
  }
}
