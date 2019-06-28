import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { StorageService } from 'src/app/shared/services/storage.service';

/*The auth guard is used to prevent unauthenticated users from accessing restricted routes */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router:Router,
              private storageService: StorageService){}
  
  canActivate() {
    console.log(this.storageService.isAuthenticated());    
    if (this.storageService.isAuthenticated()) {
    // logged in so return true
    return true;
    }

    // not logged in so redirect to login page
    this.router.navigate(['/login']);
      return false;
    }
}
