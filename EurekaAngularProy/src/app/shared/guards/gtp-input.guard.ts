import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class GtpInputGuard implements CanActivate  {

  constructor(private router: Router,
    private storageService: StorageService) {}
    
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
      if (parseInt( localStorage.getItem('prfl')) == 1 ) {
        //this.router.navigate(['/gtp']);
          return true;
      }
      else {
        this.router.navigate(['/home']);
          return true;
      }
       
    }

}
 