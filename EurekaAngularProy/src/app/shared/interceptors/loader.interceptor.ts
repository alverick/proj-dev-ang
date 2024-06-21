import {
  type HttpEvent,
  type HttpHandler,
  type HttpInterceptor,
  type HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { type Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  totalRequests = 0;
  requestsCompleted = 0;
  forbiddenUrls = [
    'notification?skip',
    'notification/total',
    'debt/process/[\\d]+/status',
  ];

  constructor(private spinner: NgxSpinnerService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
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
      void this.spinner.show();
      this.totalRequests++;
    }

    return next.handle(request).pipe(
      finalize(() => {
        if (validUrl()) {
          this.requestsCompleted++;
        }

        if (this.requestsCompleted === this.totalRequests) {
          void this.spinner.hide();
          this.totalRequests = 0;
          this.requestsCompleted = 0;
        }
      })
    );
  }
}
