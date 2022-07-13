import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { AfiliacionService } from '../../../../shared/services/afiliacion.service';
import { ExcelService } from '../../../../shared/services/excel.service';
import { LoginService } from '../../../../shared/services/login.service';
import { NotifyService } from '../../../../shared/services/notify.service';
import { internalFullRoutingNames } from '../../internal-routing.names';

@Component({
  selector: 'cs-internal-header',
  templateUrl: './internal-header.component.html',
  styleUrls: ['./internal-header.component.scss'],
})
export class InternalHeaderComponent implements OnInit {
  isExpanded = false;
  companyLink = internalFullRoutingNames.COMPANY;
  homeLink = internalFullRoutingNames.HOME;
  chargesLink = internalFullRoutingNames.CHARGES;
  homeText = 'Mis Movimientos';
  companyText = 'Mi Empresa';
  chargesText = 'Mis Servicios';
  scrollConfig = {
    suppressScrollX: true,
  };

  constructor(
    private router: Router,
    public notify: NotifyService,
    private loginService: LoginService,
    private spinner: NgxSpinnerService,
    private excelser: ExcelService,
    public afiliacionService: AfiliacionService
  ) {}

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  ngOnInit() {
    this.notify.clear();
    this.spinner.hide();
    this.notify.iniciar();
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
    this.spinner.show();
    this.loginService.logout();
    this.excelser.statusUpload = false;
    this.spinner.hide();
    this.isExpanded = false;
  }

  clearServices() {
    this.afiliacionService.services = [];
  }
}
