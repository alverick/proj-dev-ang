import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

declare var gtag: (...any) => void;

@Injectable({
  providedIn: 'root',
})
export class GoogleAnalytics {
  public static Afiliacion = 'Afiliación';
  public static Dashboard = 'Dashboard';
s
  public sendEvent(name: string, args: any = null) {
    if (environment.production) {
      gtag('event', name, args);
    }
  }

  public sendException(error: Error, fatal: boolean = true) {
    if (environment.production) {
      if (error instanceof HttpErrorResponse) {
        gtag('event', 'exception', {
          description: `${error.status} => ${error.message}`,
          fatal,
        });
      } else {
        gtag('event', 'exception', {
          description: error.message,
          fatal,
        });
      }
    }
  }

  public sendUrl(title: string, url: string) {
    if (environment.production) {
      gtag('config', 'UA-148142629-1', {
        page_title: title,
        page_path: url,
      });
    }
  }
}
