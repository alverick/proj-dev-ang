    import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { Session } from "../models/session.model";
import { User } from "../models/user.model";
import { CookieService } from 'ngx-cookie-service';


@Injectable({
    providedIn: 'root'
  }
)
export class StorageService {
  redirectUrl: string;

  private localStorageService;
  private currentSession: Session = null;

  constructor(private cookieStorage: CookieService) {
    this.localStorageService = localStorage;
    this.currentSession = this.loadSessionData();
  }

  setCurrentSession(session: Session): void {
    this.currentSession = session;

    if (session.token === 'RUC no esta registrado'  ||  session.token ===  'Un session ya se encuentra activa'  ||  session.token ===  'Credenciales invalidas') {
       return ;
    } else {
      this.localStorageService.setItem('tk', session.token);
    }
  }

  loadSessionData(): Session {
    if (this.cookieStorage.check('ruc')) {
      return {
        user: { ruc: this.cookieStorage.get('ruc') },
        isAuthenticate: false,
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
    const token = this.localStorageService.getItem('tk');
    return (this.currentSession && this.currentSession.isAuthenticate);
  };

  getCurrentToken(): string {
    var session = this.getCurrentSession();
    return (session && session.token) ? session.token : null;
  };
/*
  logout(): void{
    this.removeCurrentSession();
    this.router.navigate(['/login']);
  }
*/
}
