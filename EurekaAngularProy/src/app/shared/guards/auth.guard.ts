import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { StorageService } from 'src/app/shared/services/storage.service';
import Swal from 'sweetalert2';

/*The auth guard is used to prevent unauthenticated users from accessing restricted routes */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
              private storageService: StorageService) {}

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    return this.checkLogin(url);
  }

  checkLogin(url: string): boolean {
    let session = this.storageService.getCurrentSession();
    if (session && session.isAuthenticate) {

      return true;
    }
    else {
      //this.router.navigate(['/login']);
      location.href = '/login';
      return false;
    }
  }
}
