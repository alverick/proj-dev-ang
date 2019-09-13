
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/shared/services/login.service';
import { NgxSpinnerService } from 'ngx-spinner';
import Swal from 'sweetalert2';
import { ExcelService } from '../services/excel.service';
import { NotifyService } from '../services/notify.service';
import * as moment from 'moment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  showHead: boolean = null;

  constructor(private router: Router,
              private loginService: LoginService,
              private spinner: NgxSpinnerService,
              private excelser: ExcelService,
              public notify: NotifyService ) {
  }

  ngOnInit() {
    this.notify.messages = [];
    this.spinner.hide();
    this.notify.iniciar();
  }

  public menu(): boolean {
    if (localStorage.getItem('tk') == null) {
      return false;

    } else {
      return true;
    }
  }
  mesageeError(tipo: any, titulo: string, text: string) {
    Swal.fire({
      type: tipo ,
      title: titulo ,
      text: text,
      showCloseButton: true,
      showCancelButton: true,
      showConfirmButton: false,
      cancelButtonColor: '#d33',
      cancelButtonText:  'Cerrar',
      allowOutsideClick: false

    });
  }

  public logout(): void {
    this.spinner.show();
    this.loginService.logout();
    this.excelser.statusUpload = false;
    this.spinner.hide();

  }

  public show(): boolean {
    console.log(this.router.url);
    if (this.router.url.includes('/login') ||
     this.router.url.includes('/afiliacion') ||
     this.router.url.includes('/crearContrasena') ||
     this.router.url.includes('/configurarServicios') ||
     this.router.url.includes('/procesando')) {
      return false;
    }
    return true;
  }

  getAgo(date): string {
    return moment.utc(date).fromNow();
  }

  onScroll() {
    console.log('scroll');
    if (this.notify.messages.length > 0) {
      this.notify.loadMsgs();
    }
  }

  onShowMessages() {
    console.log('show Messages');
  }
}
