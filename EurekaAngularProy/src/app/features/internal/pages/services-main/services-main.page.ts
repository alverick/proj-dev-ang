import { type OnDestroy, type OnInit, Component } from '@angular/core';
import {
  type RouterEvent,
  ActivatedRoute,
  NavigationEnd,
  Router,
  Scroll,
} from '@angular/router';
import { isNotNilOrEmpty } from 'ramda-adjunct';
import { type Observable, Subject } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';

import {
  type CurrencyWithLimit,
  currencies,
} from '../../../../shared/constants/currencies';
import {
  type AmountLimit,
  collectionRestrictionTypes,
  type IDataEnterpriseModel,
} from '../../../../shared/models/data-enterprise.model';
import {
  ServicesFormsService,
  ServiceTypes,
} from '../../../../shared/services/services-forms.service';
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
  limitsAmountMax: AmountLimit[] = null;
  currency: CurrencyWithLimit = null;
  constructor(
    protected router: Router,
    public companyServices: CompanyServicesService,
    private activatedRoute: ActivatedRoute,
    private servicesFormsService: ServicesFormsService
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
      this.companyServices.allowAllServiceType =
        company.collectionRestriction ===
        collectionRestrictionTypes.notRestricted;
      this.limitsAmountMax = company.amountLimits;
      this.companyServices.setDefaultType(
        company.collectionRestriction ===
          collectionRestrictionTypes.notRestricted
          ? ServiceTypes.withoutData
          : ServiceTypes.complete
      );
    });
    this.servicesFormsService.serviceForm
      .get('currency')
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        filter((data) => isNotNilOrEmpty(data))
      )
      .subscribe((val) => {
        const currencySel = currencies.find((limit) => limit.code === val);

        const limitSel =
          this.limitsAmountMax.find(
            (limit) => limit.currency === currencySel.code
          )?.amountMax || null;

        this.currency = { ...currencySel, limitMax: limitSel };
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
