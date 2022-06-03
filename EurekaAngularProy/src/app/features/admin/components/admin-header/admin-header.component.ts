import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { appFullRoutingNames } from 'src/app/app-routing.collection';
import { ExcelService } from '../../../../shared/services/excel.service';
import { LoginService } from '../../../../shared/services/login.service';
import { adminFullRoutingNames } from '../../admin-routing.names';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.scss'],
})
export class AdminHeaderComponent {
  linkSetupEmail = adminFullRoutingNames.SETUP_EMAIL;
  constructor(
    private router: Router,
    private loginService: LoginService,
    private spinner: NgxSpinnerService,
    private excelser: ExcelService
  ) {}

  get IsGtp(): boolean {
    return this.router.url.includes(appFullRoutingNames.ADMIN);
  }

  goBackGtp() {
    if (confirm('Es posible que los cambios no se guarden.')) {
      this.router.navigate([appFullRoutingNames.ADMIN]);
    }
  }

  public logout(): void {
    this.spinner.show();
    this.loginService.logout();
    this.excelser.statusUpload = false;
    this.spinner.hide();
  }
}
