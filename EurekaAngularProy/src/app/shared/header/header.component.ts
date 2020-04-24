
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/shared/services/login.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { ExcelService } from '../services/excel.service';
import { NotifyService } from '../services/notify.service';
import * as moment from 'moment';
import { drawPopup } from '../services/popups';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  showHead: boolean = null;

  isExpanded = false;

  constructor(private router: Router,
    private loginService: LoginService,
    private spinner: NgxSpinnerService,
    private excelser: ExcelService,
    public notify: NotifyService) {
  }

  scrollConfig = {
    suppressScrollX: true
  };

  ngOnInit() {
    this.notify.clear();
    this.spinner.hide();
    this.notify.iniciar();
  }

  public menu(): boolean {
    if (this.router.url.includes('/cambiaContra') ||
      this.router.url.includes('/recupera') ||
      this.router.url.includes('/login') ||
      this.router.url.includes('/landing') ||
      this.router.url.includes('/gtp') ||
      this.router.url.includes('/gtp')) {
      return false;

    } else {
      return true;
    }
  }

  onClass(): boolean {
    if (this.router.url.includes('/home') ||
      this.router.url.includes('/gtp')) {
      return false;

    } else {
      return true;
    }
  }
  public menuGtp(): boolean {
    if (this.router.url.includes('/gtp')) {
      return true;

    } else {
      return false;
    }
  }
  mesageeError(tipo: any, titulo: string, text: string) {
    Swal.fire({
      title: titulo,
      text: text,
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonText: 'Cerrar',
      allowOutsideClick: false,
      onOpen: drawPopup

    });
  }

  public logout(): void {
    this.spinner.show();
    this.loginService.logout();
    this.excelser.statusUpload = false;
    this.spinner.hide();
    this.isExpanded = false;


  }
  onRegresar

  public show(): boolean {
    if (this.router.url.includes('/login') ||
      this.router.url.includes('/cambiaContra') ||
      this.router.url.includes('/recupera') ||
      // this.router.url.includes('/afiliacion') ||
      // this.router.url.includes('/crearContrasena') ||
      this.router.url.includes('/editaCuenta') ||
      this.router.url.includes('/editarSvcGTP') ||
      this.router.url.includes('/configurarServicios') ||

      this.router.url.includes('/procesando')) {
      return false;
    }
    return true;
  }
  onAfilacion(): boolean {
    if (this.router.url.includes('/crearContrasena')) {
      return false;
    }
    return true;
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

  onShowMessages() {
  }


  goBackEmpresa() {
    if (confirm('Es posible que los cambios no se guarden.')) {
      this.router.navigate(['/afiliacion']);
    }
  }
  goBack() {
    if (confirm('Es posible que los cambios no se guarden.')) {
      this.router.navigate(['/home']);
    } else if (this.router.url.includes('/crearContrasena')) {
      this.router.navigate(['/afiliacion']);
    } else if (this.router.url.includes('/afiliacion')) {
      this.router.navigate(['/login']);
    }
  }
  goBackGtp() {
    if (confirm('Es posible que los cambios no se guarden.')) {
      this.router.navigate(['/gtp']);
    }
  }


  // ---------------- reónsive -------
  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }
}
