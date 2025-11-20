import { NgOptimizedImage } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import type { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';

import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { ExcelService } from '../../../../shared/services/excel.service';
import { LoginService } from '../../../../shared/services/login.service';
import { authFullRoutingNames } from '../../../auth/auth-routing.names';
import { adminFullRoutingNames } from '../../admin-routing.names';

@Component({
  selector: 'cs-admin-header',
  templateUrl: './admin-header.component.html',
  imports: [HeaderComponent, NgOptimizedImage, MenuModule],
})
export class AdminHeaderComponent {
  private readonly loginService = inject(LoginService);
  private readonly excel = inject(ExcelService);
  private readonly router = inject(Router);

  items: MenuItem[] = [
    {
      label: 'Configurar correo',
      styleClass: 'tw-text-center',
      command: () => {
        this.gotoSetupEmail();
      },
    },
    {
      label: 'Cerrar sesión',
      styleClass: 'tw-text-center',
      command: () => {
        this.logout();
      },
    },
  ];

  public gotoSetupEmail() {
    void this.router.navigate([adminFullRoutingNames.SETUP_EMAIL]);
  }

  public logout(): void {
    this.loginService.logout().subscribe(() => {
      void this.router.navigate([authFullRoutingNames.LOGIN]);
    });
    this.excel.statusUpload = false;
  }
}
