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
      if (!this.storageService.isAuthenticated()) {
        this.spinner.hide();
        return true;
      }
      else {
        console.log('nav to home');
        this.router.navigate(['/home']);
        return false;
      }
  }

}
