import { Injectable } from '@angular/core';
import { type UrlTree, Router } from '@angular/router';
import { type Observable } from 'rxjs';

import { appFullRoutingNames } from '../../app-routing.names';
import { StorageService } from '../services/storage.service';

@Injectable()
export class GtpOutputGuard {
  constructor(private router: Router, private storageService: StorageService) {}

  canActivate():
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (parseInt(sessionStorage.getItem('prfl'), 10) !== 0) {
      void this.router.navigate([appFullRoutingNames.ADMIN]);
    }
    return true;
  }
}
