import { Injectable } from "@angular/core";

declare var gtag: Function;

@Injectable({
  providedIn: 'root'
})
export class GoogleAnalytics {
  public sendEvent(name: string, args: any = null) {
    gtag('event', name, args);
  }
}
