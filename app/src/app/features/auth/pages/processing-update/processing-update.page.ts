
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { authFullRoutingNames } from '../../auth-routing.names';
import { AffiliationService } from '../../services';

@Component({
  selector: 'cs-processing-update',
  templateUrl: './processing-update.page.html',
  standalone: true,
  imports: []
})
export class ProcessingUpdatePage implements OnInit {
  public email: string;

  constructor(
    public affiliation: AffiliationService,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    this.email = this.affiliation.email;
  }

  onCerrar() {
    void this.router.navigate([authFullRoutingNames.LOGIN]);
  }
}
