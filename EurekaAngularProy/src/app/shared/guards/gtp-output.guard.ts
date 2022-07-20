import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { appFullRoutingNames } from '../../app-routing.names';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class GtpOutputGuard implements CanActivate {
  constructor(private router: Router, private storageService: StorageService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (parseInt(sessionStorage.getItem('prfl'), 10) === 0) {
      //this.router.navigate([appFullRoutingNames.ADMIN]);
      return true;
    } else {
      this.router.navigate([appFullRoutingNames.ADMIN]);
      return true;
    }
  }
}
