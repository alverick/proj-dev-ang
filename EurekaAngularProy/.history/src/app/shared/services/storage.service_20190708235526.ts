import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { Session } from "../models/session.model";
import { User } from "../models/user.model";
import { CookieService } from 'ngx-cookie-service';


@Injectable()
export class StorageService {
    
  private localStorageService;
  private currentSession : Session = null;

  constructor(private router: Router, private cookieStorage: CookieService) {
    this.localStorageService = localStorage;
    this.currentSession = this.loadSessionData();
  }

  setCurrentSession(session: Session): void {
    this.currentSession = session;
    this.cookieStorage.set('ruc', session.user.ruc);
    this.localStorageService.setItem('tk', session.token);
  }

  loadSessionData(): Session{
    if (this.cookieStorage.check('ruc')) {
      return {
        user: { ruc: this.cookieStorage.get('ruc') },
        token: null
      };
    }
    return null;
  }

  getCurrentSession(): Session {
    return this.currentSession;
  }

  removeCurrentSession(): void {
    this.localStorageService.removeItem('tk');
    this.currentSession = null;
  }

  getCurrentUser(): User {
    var session: Session = this.getCurrentSession();
    return (session && session.user) ? session.user : null;
  };

  isAuthenticated(): boolean {
    return (this.getCurrentToken() != null) ? true : false;
  };

  getCurrentToken(): string {
    var session = this.getCurrentSession();
    return (session && session.token) ? session.token : null;
  };

  logout(): void{
    this.removeCurrentSession();
    this.router.navigate(['/login']);
  }

}
