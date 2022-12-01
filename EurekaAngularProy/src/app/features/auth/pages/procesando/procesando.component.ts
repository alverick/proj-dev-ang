import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { authFullRoutingNames } from '../../auth-routing.names';
import { AffiliationService } from '../../services';

@Component({
  selector: 'cs-procesando',
  templateUrl: './procesando.component.html',
  styleUrls: ['./procesando.component.scss'],
})
export class ProcesandoComponent implements OnInit {
  public email: string;
  constructor(public affiliation: AffiliationService, private router: Router) {}

  ngOnInit() {
    this.email = this.affiliation.email;
  }
  onCerrar() {
    this.router.navigate([authFullRoutingNames.LOGIN]);
  }
}
