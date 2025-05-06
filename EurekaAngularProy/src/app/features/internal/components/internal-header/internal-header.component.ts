import { NgClass, NgOptimizedImage } from '@angular/common';
import { Component, type OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import moment from 'moment';
import { NgClickOutsideDirective } from 'ng-click-outside2';
import { NgScrollbar } from 'ngx-scrollbar';
import { NgScrollReached } from 'ngx-scrollbar/reached-event';
import { type MenuItem } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonDirective } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { Ripple } from 'primeng/ripple';

import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { AfiliacionService } from '../../../../shared/services/afiliacion.service';
import { ExcelService } from '../../../../shared/services/excel.service';
import { LoginService } from '../../../../shared/services/login.service';
import {
  type MessagesType,
  NotifyService,
} from '../../../../shared/services/notify.service';
import { StorageService } from '../../../../shared/services/storage.service';
import {
  AdobeEvent,
  TrackingService,
} from '../../../../shared/services/tracking.service';
import { authFullRoutingNames } from '../../../auth/auth-routing.names';
import { internalFullRoutingNames } from '../../internal-routing.names';

@Component({
  selector: 'cs-internal-header',
  templateUrl: './internal-header.component.html',
  standalone: true,
  imports: [
    HeaderComponent,
    NgClass,
    NgClickOutsideDirective,
    RouterLinkActive,
    RouterLink,
    BadgeModule,
    NgScrollbar,
    NgScrollReached,
    NgOptimizedImage,
    MenuModule,
    ButtonDirective,
    Ripple,
  ],
})
export class InternalHeaderComponent implements OnInit {
  isExpanded = false;
  showMenu = false;
  companyLink = internalFullRoutingNames.COMPANY;
  homeLink = internalFullRoutingNames.HOME;
  dashboardLink = internalFullRoutingNames.DASHBOARD;
  servicesLink = internalFullRoutingNames.SERVICES;
  helpLink = internalFullRoutingNames.HELP;
  homeText = 'Mis Movimientos';
  helpText = 'Ayuda';
  companyText = 'Mi Empresa';
  dashboardText = 'Mi Resumen';
  chargesText = 'Mis Servicios';
  hiddenNotifications = true;
  items: MenuItem[] = [
    {
      label: 'Cerrar sesión',
      styleClass: 'tw-text-center',
      command: () => {
        this.logout();
      },
    },
  ];

  constructor(
    private readonly router: Router,
    public notify: NotifyService,
    private readonly loginService: LoginService,
    private readonly excelser: ExcelService,
    public afiliacionService: AfiliacionService,
    private readonly storage: StorageService,
    private readonly tracking: TrackingService,
  ) {}

  toggleMenu() {
    this.isExpanded = false;
  }
  toggle(evt: PointerEvent) {
    evt.stopPropagation();
    this.hiddenNotifications = true;
    this.isExpanded = !this.isExpanded;
    this.tracking.trackEvent(AdobeEvent.trackAction, {
      category: 'Navigation',
      action: 'Click',
      detail: 'Menu móvil',
      label: 'Menu',
      typeElement: 'Link',
      location: 'Header',
    });
  }

  ngOnInit() {
    this.notify.clear();
    this.notify.iniciar();
    this.storage.getCurrentSession();
    this.showMenu = this.storage.isValidSession();
  }

  goResumenCobros() {
    this.clearServices();
  }

  onScroll() {
    if (this.notify.messages.length > 0) {
      this.notify.loadMessages();
    }
  }

  getAgo(date: string): string {
    return moment.utc(date).local().format('DD/MM/YY [a las] hh:mm a');
  }

  public logout(): void {
    this.loginService.logout().subscribe(() => {
      void this.router.navigate([authFullRoutingNames.LOGIN]);
    });
    this.excelser.statusUpload = false;
    this.isExpanded = false;
    this.tracking.trackEvent(AdobeEvent.trackAction, {
      category: 'Navigation',
      action: 'Click',
      detail: 'Cerrar Sesión',
      label: 'Cerrar Sesión',
      typeElement: 'Link',
      location: 'Header',
    });
  }

  clearServices() {
    this.afiliacionService.services = [];
  }

  gotoChargesPage() {
    this.tracking.trackEvent(AdobeEvent.trackAction, {
      category: 'Navigation',
      action: 'Click',
      detail: 'Enlace a ' + this.chargesText,
      label: this.chargesText,
      typeElement: 'Link',
      location: 'Header',
    });
  }

  gotoHomePage() {
    this.tracking.trackEvent(AdobeEvent.trackAction, {
      category: 'Navigation',
      action: 'Click',
      detail: 'Enlace a ' + this.homeText,
      label: this.homeText,
      typeElement: 'Link',
      location: 'Header',
    });
  }

  gotoCompanyPage() {
    this.tracking.trackEvent(AdobeEvent.trackAction, {
      category: 'Navigation',
      action: 'Click',
      detail: 'Enlace a ' + this.companyText,
      label: this.companyText,
      typeElement: 'Link',
      location: 'Header',
    });
  }

  gotoHelpPage() {
    this.tracking.trackEvent(AdobeEvent.trackAction, {
      category: 'Navigation',
      action: 'Click',
      detail: 'Enlace a ' + this.helpText,
      label: this.helpText,
      typeElement: 'Link',
      location: 'Header',
    });
  }

  toggleNotifyList() {
    this.hiddenNotifications = !this.hiddenNotifications;
    this.tracking.trackEvent(AdobeEvent.trackAction, {
      category: 'Navigation',
      action: 'Click',
      detail: 'Mostrar notificaciones',
      label: 'Notificaciones',
      typeElement: 'Link',
      location: 'Header',
    });
  }

  markAllNotifications() {
    this.notify.markAll();
    this.tracking.trackEvent(AdobeEvent.trackAction, {
      category: 'Navigation',
      action: 'Click',
      detail: 'Marcar todas como leídas',
      label: 'Marcar todas como leídas',
      typeElement: 'Link',
      location: 'Header',
    });
  }

  markNotification(msg: MessagesType, $event: MouseEvent) {
    this.notify.changeRead(msg);
    $event.stopPropagation();
    this.tracking.trackEvent(AdobeEvent.trackAction, {
      category: 'Navigation',
      action: 'Click',
      detail: 'Marcar notificación como leída',
      label: 'Marcar notificación como leída',
      typeElement: 'Link',
      location: 'Header',
    });
  }

  blurMenu() {
    this.hiddenNotifications = true;
  }
}
