import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AfiliacionService } from 'src/app/shared/services/afiliacion.service';
import { authFullRoutingNames } from '../../auth-routing.names';

@Component({
  selector: 'cs-procesando',
  templateUrl: './procesando.component.html',
  styleUrls: ['./procesando.component.scss'],
})
export class ProcesandoComponent implements OnInit {
  public email: string;
  constructor(public afiliacion: AfiliacionService, private router: Router) {}

  ngOnInit() {
    this.email = this.afiliacion.email;
  }
  onCerrar() {
    this.router.navigate([authFullRoutingNames.LOGIN]);
  }
}
