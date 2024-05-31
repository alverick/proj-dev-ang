import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, NgZone } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class ScriptInjectorService {
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private zone: NgZone
  ) {}
  load(id: string, src: string) {
    const scriptElement: HTMLScriptElement =
      this.document.createElement('script');
    scriptElement.id = id;
    scriptElement.src = src;
    scriptElement.async = false;
    const promise = new Promise((resolve, reject) => {
      scriptElement.addEventListener('load', () => {
        setTimeout(resolve, 10);
      });
      scriptElement.addEventListener('error', () => {
        reject(new Error('failed to load script'));
      });
    });

    this.zone.runOutsideAngular(() => {
      this.document.head.appendChild(scriptElement);
    });
    return promise;
  }
}
