import { Component } from '@angular/core';
import { ExcelService } from '../../../../shared/services/excel.service';
import { LoginService } from '../../../../shared/services/login.service';
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
    private excelser: ExcelService
  ) {}

  public logout(): void {
    this.loginService.logout();
    this.excelser.statusUpload = false;
  }
}
