import { Component, inject, type OnDestroy, type OnInit } from '@angular/core';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterOutlet,
  Scroll,
} from '@angular/router';
import { isNil } from 'ramda';
import { isNotNilOrEmpty } from 'ramda-adjunct';
import { type Observable, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';

import { SidebarServiceComponent } from '../../../../shared/components/sidebar-service/sidebar-service.component';
import {
  currencies,
  type CurrencyWithLimit,
} from '../../../../shared/constants/currencies';
import { ServiceTypes } from '../../../../shared/constants/services';
import {
  type AmountLimit,
  collectionRestrictionTypes,
  type IDataEnterpriseModel,
} from '../../../../shared/models/data-enterprise.model';
import { ServicesFormsService } from '../../../../shared/services';
import {
  internalFullRoutingChildNames,
  internalFullRoutingNames,
} from '../../internal-routing.names';
import { CompanyServicesService } from '../../services';

@Component({
  selector: 'cs-internal-services-main',
  templateUrl: './services-main.page.html',
  standalone: true,
  imports: [SidebarServiceComponent, RouterOutlet],
})
export class ServicesMainPage implements OnInit, OnDestroy {
  protected router = inject(Router);
  companyServices = inject(CompanyServicesService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly servicesFormsService = inject(ServicesFormsService);

  destroy$ = new Subject();
  position = 2;
  limitsAmountMax: AmountLimit[] = null;
  useAmountLimits = false;
  currency: CurrencyWithLimit = null;

  constructor() {
    const router = this.router;

    router.events
      .pipe(
        map((evt) => (evt instanceof Scroll ? evt.routerEvent : evt)),
        takeUntil(this.destroy$),
      )
      .subscribe((val) => {
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
      let collectionRestriction = company.collectionRestriction;
      if (isNil(collectionRestriction)) {
        collectionRestriction = collectionRestrictionTypes.notRestricted;
      }

      this.companyServices.allowAllServiceType =
        collectionRestriction === collectionRestrictionTypes.notRestricted;
      this.limitsAmountMax = company.amountLimits;
      this.companyServices.setDefaultType(
        collectionRestriction === collectionRestrictionTypes.notRestricted
          ? ServiceTypes.withoutData
          : ServiceTypes.complete,
      );
    });
    this.servicesFormsService.serviceForm
      .get('currency')
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        filter((data) => isNotNilOrEmpty(data)),
      )
      .subscribe((val) => {
        const currencySel = currencies.find((limit) => limit.code === val);

        const limitSel =
          this.limitsAmountMax.find(
            (limit) => limit.currency === currencySel.code,
          )?.amountMax || null;

        this.currency = { ...currencySel, limitMax: limitSel };
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
