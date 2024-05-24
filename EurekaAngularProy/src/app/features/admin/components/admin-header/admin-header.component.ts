import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { ExcelService } from '../../../../shared/services/excel.service';
import { LoginService } from '../../../../shared/services/login.service';
import { authFullRoutingNames } from '../../../auth/auth-routing.names';
import { adminFullRoutingNames } from '../../admin-routing.names';

@Component({
  selector: 'cs-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss'],
})
export class AdminHeaderComponent {
  linkSetupEmail = adminFullRoutingNames.SETUP_EMAIL;
  constructor(
    private loginService: LoginService,
    private excelser: ExcelService,
    private router: Router
  ) {}

  public logout(): void {
    this.loginService.logout().subscribe(() => {
      void this.router.navigate([authFullRoutingNames.LOGIN]);
    });
    this.excelser.statusUpload = false;
  }
}
