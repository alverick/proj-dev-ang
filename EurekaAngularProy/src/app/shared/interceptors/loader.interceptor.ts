import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  totalRequests = 0;
  requestsCompleted = 0;
  forbiddenUrls = ['notification?skip', 'notification/total'];

  constructor(private spinner: NgxSpinnerService) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const validUrl = () => {
      let isValid = true;
      this.forbiddenUrls.forEach((url) => {
        if (request.url.includes(url)) {
          isValid = false;
        }
      });
      return isValid;
    };
    if (validUrl()) {
      this.spinner.show();
      this.totalRequests++;
    }

    return next.handle(request).pipe(
      finalize(() => {
        if (validUrl()) {
          this.requestsCompleted++;
        }

        if (this.requestsCompleted === this.totalRequests) {
          this.spinner.hide();
          this.totalRequests = 0;
          this.requestsCompleted = 0;
        }
      })
    );
  }
}
