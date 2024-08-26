import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { internalFullRoutingNames } from '../../features/internal/internal-routing.names';

@Injectable()
export class LogoutGuard {
  constructor(private router: Router) {}
  canActivate(): boolean {
    if (
      sessionStorage.getItem('tk') == null ||
      sessionStorage.getItem('tk') === 'El usuario esta bloqueado' ||
      sessionStorage.getItem('tk') === 'Vuelva a intentarlo mas tarde'
    ) {
      return true;
    }
    // si el token existe
    if (sessionStorage.getItem('tk')) {
      // entonces enviame al home
      void this.router.navigate([internalFullRoutingNames.HOME]);
      // que no me deje ver el login o
      return false;
    }
  }
}
