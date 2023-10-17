import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ServiceService {
  constructor(private http: HttpClient) {}

  checkCanDeleteService(serviceId: number): Observable<any> {
    const url = `${environment.END_POINT}/service/${serviceId}/canDelete`;
    return this.http.get<any>(url);
  }

  public deleteService(serviceId: number) {
    const url = `${environment.END_POINT}/service/${serviceId}`;
    return this.http.post(url, null);
  }
}
