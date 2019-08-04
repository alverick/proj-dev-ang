import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class LogoutGuard implements CanActivate {

  constructor(private router: Router, private storageService: StorageService) {

  }
  canActivate(next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    return this.checkLogout(url);
  }


  checkLogout(url: string): boolean{
    if(this.storageService.isAuthenticated()){
      this.router.navigate(['/home']);
      return false;
    }else{
      this.router.navigate(['/login']);
      return true;
    }
  }
}




/*
    if (localStorage.getItem('tk') === null) {
       return true;
     }
    if ( localStorage.getItem('tk') ) {
      this.router.navigate(['/home']);
        return false;
    }
*/
