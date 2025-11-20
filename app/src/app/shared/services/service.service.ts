import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { type Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable()
export class ServiceService {
  private readonly http = inject(HttpClient);

  checkCanDeleteService(serviceId: number): Observable<any> {
    const url = `${environment.END_POINT}/service/${serviceId}/canDelete`;
    return this.http.get<any>(url);
  }

  public deleteService(serviceId: number) {
    const url = `${environment.END_POINT}/service/${serviceId}`;
    return this.http.post(url, null);
  }
}
