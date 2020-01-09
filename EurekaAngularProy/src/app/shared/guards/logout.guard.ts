import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class LogoutGuard implements CanActivate {

  constructor(private router: Router, private storageService: StorageService,     private spinner: NgxSpinnerService) {

  }
  canActivate(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      if (sessionStorage.getItem('tk') == null || sessionStorage.getItem('tk')=='El usuario esta bloqueado' || sessionStorage.getItem('tk')=='Vuelva a intentarlo mas tarde') {
        this.spinner.hide();
        return true;
      }
      // si el token existe
     if ( sessionStorage.getItem('tk') ) {
       // entonces enviame al home
       this.router.navigate(['/home']);
       // que no me deje ver el login o
         return false;
     }
  }

}
