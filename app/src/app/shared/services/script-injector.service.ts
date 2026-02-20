import { DOCUMENT, inject, Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ScriptInjectorService {
  private readonly document = inject<Document>(DOCUMENT);

  private readonly scripts = new Map<string, ReplaySubject<boolean>>();

  loadScript(
    id: string,
    src: string,
    options?: Partial<HTMLScriptElement>,
  ): Observable<boolean> {
    if (this.scripts.has(id)) {
      return this.scripts.get(id).asObservable();
    }

    const subject = new ReplaySubject<boolean>(1);
    this.scripts.set(id, subject);

    const existingScript = this.document.getElementById(
      id,
    ) as HTMLScriptElement | null;

    if (existingScript) {
      if (existingScript.dataset['loaded'] === 'true') {
        subject.next(true);
        subject.complete();
      } else {
        existingScript.addEventListener('load', () => {
          subject.next(true);
          subject.complete();
        });

        existingScript.addEventListener('error', () => {
          subject.error(false);
        });
      }

      return subject.asObservable();
    }

    const script = this.document.createElement('script');
    script.id = id;
    script.type = 'text/javascript';
    script.src = src;
    script.async = true;

    Object.assign(script, options);

    script.onload = () => {
      script.dataset['loaded'] = 'true';
      subject.next(true);
      subject.complete();
    };

    script.onerror = () => {
      subject.error(false);
    };

    this.document.head.appendChild(script);

    return subject.asObservable();
  }
}
