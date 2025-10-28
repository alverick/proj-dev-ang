import { type HttpEvent, type HttpHandler, type HttpInterceptor, type HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { type Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { AppConfigActions } from '../../store/actions/app-config.actions';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  totalRequests = 0;
  requestsCompleted = 0;
  forbiddenUrls = [
    'notification\\?skip',
    'notification/total',
    'debt/process/[\\d]+/status',
    'debt/service/[^\\/]+/debtor/[\\w]+',
  ];

  constructor(private readonly store: Store) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    const validUrl = () => {
      let isValid = true;
      this.forbiddenUrls.forEach((url) => {
        const regex = new RegExp(url);
        if (regex.test(request.url)) {
          isValid = false;
        }
      });
      return isValid;
    };
    if (validUrl()) {
      this.store.dispatch(AppConfigActions.setLoader({ show: true }));
      this.totalRequests++;
    }

    return next.handle(request).pipe(
      finalize(() => {
        if (validUrl()) {
          this.requestsCompleted++;
        }

        if (this.requestsCompleted === this.totalRequests) {
          this.store.dispatch(AppConfigActions.setLoader({ show: false }));
          this.totalRequests = 0;
          this.requestsCompleted = 0;
        }
      }),
    );
  }
}
