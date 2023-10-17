import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';

import { AfiliacionService } from '../../../../shared/services/afiliacion.service';
import { ExcelService } from '../../../../shared/services/excel.service';
import { LoginService } from '../../../../shared/services/login.service';
import { NotifyService } from '../../../../shared/services/notify.service';
import { StorageService } from '../../../../shared/services/storage.service';
import { authFullRoutingNames } from '../../../auth/auth-routing.names';
import { internalFullRoutingNames } from '../../internal-routing.names';

@Component({
  selector: 'cs-internal-header',
  templateUrl: './internal-header.component.html',
  styleUrls: ['./internal-header.component.scss'],
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
  scrollConfig = {
    suppressScrollX: true,
  };

  constructor(
    private router: Router,
    public notify: NotifyService,
    private loginService: LoginService,
    private excelser: ExcelService,
    public afiliacionService: AfiliacionService,
    private storage: StorageService
  ) {}

  toggle() {
    this.isExpanded = !this.isExpanded;
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
      this.notify.loadMsgs();
    }
  }

  getAgo(date): string {
    return moment.utc(date).local().format('DD/MM/YY [a las] hh:mm a');
  }

  public logout(): void {
    this.loginService.logout().subscribe(() => {
      void this.router.navigate([authFullRoutingNames.LOGIN]);
    });
    this.excelser.statusUpload = false;
    this.isExpanded = false;
  }

  clearServices() {
    this.afiliacionService.services = [];
  }
}
