import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterEvent,
  Scroll,
} from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { IDataEnterpriseModel } from '../../../../shared/models/data-enterprise.model';
import { ServiceTypes } from '../../../../shared/services/services-forms.service';
import {
  internalFullRoutingChildNames,
  internalFullRoutingNames,
} from '../../internal-routing.names';
import { CompanyServicesService } from '../../services';

@Component({
  selector: 'cs-internal-services-main',
  templateUrl: './services-main.page.html',
  styleUrls: ['./services-main.page.scss'],
})
export class ServicesMainPage implements OnInit, OnDestroy {
  destroy$ = new Subject();
  position = 2;
  constructor(
    protected router: Router,
    public companyServices: CompanyServicesService,
    private activatedRoute: ActivatedRoute
  ) {
    router.events
      .pipe(
        map((evt) => (evt instanceof Scroll ? evt.routerEvent : evt)),
        takeUntil(this.destroy$)
      )
      .subscribe((val: RouterEvent) => {
        if (val instanceof NavigationEnd) {
          switch (val.url) {
            case internalFullRoutingChildNames.SERVICES_ADD_INFO:
              this.position = 0;
              break;
            case internalFullRoutingChildNames.SERVICES_ADD_CONFIGURATION:
              this.position = 1;
              break;
            case internalFullRoutingNames.SERVICES:
            default:
              this.position = 2;
              break;
          }
        }
      });
  }

  ngOnInit() {
    (
      this.activatedRoute.data as Observable<{
        company: IDataEnterpriseModel;
      }>
    ).subscribe(({ company }) => {
      this.companyServices.allowAllServiceType = !company.isNewFlow;
      this.companyServices.setDefaultType(
        company.isNewFlow ? ServiceTypes.complete : ServiceTypes.withoutData
      );
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
