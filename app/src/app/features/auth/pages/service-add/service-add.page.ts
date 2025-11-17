import { CommonModule, NgClass } from '@angular/common';
import { Component, HostListener, type OnDestroy } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet, Scroll } from '@angular/router';
import { StepsModule } from 'primeng/steps';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { SidebarServiceComponent } from '../../../../shared/components/sidebar-service/sidebar-service.component';
import { authFullRoutingChildNames } from '../../auth-routing.names';
import { AffiliationService } from '../../services';

@Component({
  selector: 'cs-service-add',
  templateUrl: './service-add.page.html',
  standalone: true,
  imports: [
    CommonModule,
    SidebarServiceComponent,
    NgClass,
    StepsModule,
    RouterOutlet,
  ],
})
export class ServiceAddPage implements OnDestroy {
  destroy$ = new Subject();
  position = 0;
  steps = [{ title: 'Step 1' }, { title: 'Step 2' }];

  constructor(
    protected router: Router,
    public affiliation: AffiliationService,
  ) {
    router.events
      ?.pipe(
        map((evt) => (evt instanceof Scroll ? evt.routerEvent : evt)),
        takeUntil(this.destroy$),
      )
      .subscribe((val) => {
        if (val instanceof NavigationEnd) {
          switch (val.url) {
            case authFullRoutingChildNames.SERVICES_ADD_CONFIGURATION:
              this.position = 1;
              break;
            case authFullRoutingChildNames.SERVICES_ADD_INFO:
              this.position = 0;
              break;
            case authFullRoutingChildNames.SERVICES_ADD_LIST:
            default:
              this.position = 2;
              break;
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: BeforeUnloadEvent) {
    event.preventDefault();
  }
}
