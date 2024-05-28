import { Injectable } from '@angular/core';
import { type CanActivate, type UrlTree, Router } from '@angular/router';
import { type Observable } from 'rxjs';

import { internalFullRoutingNames } from '../../features/internal/internal-routing.names';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root',
})
export class GtpInputGuard implements CanActivate {
  constructor(private router: Router, private storageService: StorageService) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (parseInt(sessionStorage.getItem('prfl'), 10) !== 1) {
      this.router.navigate([internalFullRoutingNames.HOME]);
    }
    return true;
  }
}
