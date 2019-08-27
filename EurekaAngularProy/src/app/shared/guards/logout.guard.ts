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
      console.log('logout.guard');
      if (localStorage.getItem('tk') == null || localStorage.getItem('tk')=='El usuario esta bloqueado' || localStorage.getItem('tk')=='Vuelva a intentarlo mas tarde') {
        this.spinner.hide();
        return true;
      }
     if ( localStorage.getItem('tk') ) {
       this.router.navigate(['/home']);
         return false;
     }
  }

}
