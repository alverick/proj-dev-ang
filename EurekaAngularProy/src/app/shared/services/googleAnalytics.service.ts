import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";

declare var gtag: Function;

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalytics {
  public static Afiliacion: string = 'Afiliación';
  public static Dashboard: string = 'Dashboard';

  public sendEvent(name: string, args: any = null) {
    gtag('event', name, args);
  }

  public sendException(error: Error, fatal: boolean = true) {
    console.log(error);
    if (error instanceof HttpErrorResponse) {
      gtag('event', 'exception', { description: `${error.status} => ${error.message}`, fatal: fatal });
    }
    else {
      gtag('event', 'exception', { description: error.message, fatal: fatal });
    }
  }
}
