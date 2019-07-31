import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogoutGuard implements CanActivate {

  constructor(private router: Router) {

  }
  canActivate() {

    if (localStorage.getItem('tk') === null) {
      // this.router.navigateByUrl('/auth');
       return true;
     }
    if ( localStorage.getItem('tk') ) {
      this.router.navigate(['/home']);
        return false;
    }

  }

}
