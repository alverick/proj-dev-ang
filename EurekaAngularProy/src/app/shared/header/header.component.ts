import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { LoginService } from 'src/app/shared/services/login.service';
import { AfiliacionService } from '../services/afiliacion.service';
import { ExcelService } from '../services/excel.service';
import { NotifyService } from '../services/notify.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isExpanded = false;
  constructor(
    private router: Router,
    private loginService: LoginService,
    private spinner: NgxSpinnerService,
    private excelser: ExcelService,
    public notify: NotifyService,
    public afiliacionService: AfiliacionService
  ) {}

  scrollConfig = {
    suppressScrollX: true,
  };

  ngOnInit() {
    this.notify.clear();
    this.spinner.hide();
    this.notify.iniciar();
  }

  public menu(): boolean {
    return !(
      this.router.url.includes('/cambiaContra') ||
      this.router.url.includes('/recupera') ||
      this.router.url.includes('/login') ||
      this.router.url.includes('/landing') ||
      this.router.url.includes('/gtp') ||
      this.router.url.includes('/gtp')
    );
  }

  onClass(): boolean {
    return !(
      this.router.url.includes('/home') || this.router.url.includes('/gtp')
    );
  }
  public menuGtp(): boolean {
    return this.router.url.includes('/gtp');
  }

  public logout(): void {
    this.spinner.show();
    this.loginService.logout();
    this.excelser.statusUpload = false;
    this.spinner.hide();
    this.isExpanded = false;
  }

  public show(): boolean {
    return !(
      this.router.url.includes('/login') ||
      this.router.url.includes('/cambiaContra') ||
      this.router.url.includes('/recupera') ||
      // this.router.url.includes('/afiliacion') ||
      // this.router.url.includes('/crearContrasena') ||
      this.router.url.includes('/editaCuenta') ||
      this.router.url.includes('/editarSvcGTP') ||
      // this.router.url.includes('/configurarCorreoGTP') ||
      this.router.url.includes('/configurarServicios') ||
      this.router.url.includes('/procesando')
    );
  }
  onAfilacion(): boolean {
    return !this.router.url.includes('/crearContrasena');
  }

  get IsHome(): boolean {
    return this.router.url.includes('/home');
  }
  get IsGtp(): boolean {
    return this.router.url.includes('/gtp');
  }

  getAgo(date): string {
    return moment.utc(date).local().format('DD/MM/YY [a las] hh:mm a');
  }

  onScroll() {
    if (this.notify.messages.length > 0) {
      this.notify.loadMsgs();
    }
  }

  goBackEmpresa() {
    if (confirm('Es posible que los cambios no se guarden.')) {
      this.router.navigate(['/afiliacion']);
    }
  }

  goBack() {
    if (this.router.url.includes('/cargaHistorico')) {
      this.router.navigate(['/gtp']);
    } else if (this.router.url.includes('/crearContrasena')) {
      this.router.navigate(['/afiliacion']);
    } else if (this.router.url.includes('/afiliacion')) {
      this.router.navigate(['/login']);
    } else {
      if (confirm('Es posible que los cambios no se guarden.')) {
        this.router.navigate(['/home']);
      }
    }
  }

  goBackGtp() {
    if (confirm('Es posible que los cambios no se guarden.')) {
      this.router.navigate(['/gtp']);
    }
  }

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  goResumenCobros() {
    this.clearServices();
    this.router.navigate(['/resumenCobros']);
  }

  clearServices() {
    this.afiliacionService.services = [];
  }
}
