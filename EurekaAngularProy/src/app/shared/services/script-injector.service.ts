import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { type Observable, ReplaySubject } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ScriptInjectorService {
  private loadedLibraries: Record<string, ReplaySubject<boolean>> = {};

  constructor(@Inject(DOCUMENT) private document: Document) {}

  loadScript(id: string, src: string): Observable<boolean> {
    if (this.loadedLibraries[src]) {
      return this.loadedLibraries[src].asObservable();
    }

    this.loadedLibraries[src] = new ReplaySubject();

    const script = this.document.createElement('script');
    script.id = id;
    script.type = 'text/javascript';
    script.async = true;
    script.src = src;
    script.onload = () => {
      this.loadedLibraries[src].next(true);
      this.loadedLibraries[src].complete();
    };

    this.document.head.appendChild(script);

    return this.loadedLibraries[src].asObservable();
  }
}
