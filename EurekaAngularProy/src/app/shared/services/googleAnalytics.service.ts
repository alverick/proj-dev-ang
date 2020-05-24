import { Injectable } from "@angular/core";
import { HttpErrorResponse } from "@angular/common/http";
import { environment } from "src/environments/environment";

declare var gtag: Function;

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalytics {
  public static Afiliacion: string = 'Afiliación';
  public static Dashboard: string = 'Dashboard';

  public sendEvent(name: string, args: any = null) {
    if (environment.production) {
      gtag('event', name, args);
    }
  }

  public sendException(error: Error, fatal: boolean = true) {
    console.log(error);
    if (environment.production) {
      if (error instanceof HttpErrorResponse) {
        gtag('event', 'exception', { description: `${error.status} => ${error.message}`, fatal: fatal });
      }
      else {
        gtag('event', 'exception', { description: error.message, fatal: fatal });
      }
    }
  }

  public sendUrl(title: string, url: string) {
    if (environment.production) {
      gtag('config', 'UA-148142629-1', {
        'page_title': title,
        'page_path': url
      });
    }
  }
}
