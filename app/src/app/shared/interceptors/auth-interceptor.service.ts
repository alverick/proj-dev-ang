import {
  type HttpErrorResponse,
  type HttpEvent,
  type HttpHandler,
  type HttpInterceptor,
  type HttpRequest,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { type Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { authFullRoutingNames } from '../../features/auth/auth-routing.names';
import { StorageService } from '../services/storage.service';

export type LogoutReason = 'expired' | 'server-error';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptorService implements HttpInterceptor {
  private readonly router = inject(Router);
  private readonly storage = inject(StorageService);

  intercept(
    req: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const token: string | null = sessionStorage.getItem('tk');

    const headers: Record<string, string> = {
      'Cache-Control': 'no-cache',
      Pragma: 'no-cache',
      Expires: 'Sat, 01 Jan 2000 00:00:00 GMT',
      'Ocp-Apim-Subscription-Key': environment.OCP_KEY,
      'Ocp-Apim-Trace': 'true',
    };

    if (token) {
      headers['Authorization'] = `bearer ${token}`;
    }

    const request = req.clone({ setHeaders: headers });

    const ignoredUrls: string[] = ['https://pro.ip-api.com'];

    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        const isIgnoredUrl = ignoredUrls.some((url) =>
          request.url.includes(url),
        );

        if (isIgnoredUrl || !this.storage.isAuthenticated()) {
          return throwError(() => err);
        }

        if (err.status === 401) {
          this.navigateToLoginWithReason('expired');
        } else if (err.status !== 400) {
          this.navigateToLoginWithReason('server-error');
        }

        return throwError(() => err);
      }),
    );
  }

  private navigateToLoginWithReason(reason: LogoutReason): void {
    this.storage.removeCurrentSession();
    void this.router.navigate([authFullRoutingNames.LOGIN], {
      queryParams: { reason: reason },
      replaceUrl: true,
    });
  }
}
