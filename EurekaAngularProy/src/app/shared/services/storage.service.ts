import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

import { type Session } from '../models/session.model';
import { type User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private localStorageService;
  private currentSession: Session = null;

  constructor(private cookieStorage: CookieService) {
    this.localStorageService = window.sessionStorage;
    this.currentSession = this.loadSessionData();
  }

  setCurrentSession(session: Session): void {
    this.currentSession = session;
    if (
      session.token === 'RUC no esta registrado' ||
      session.token === 'Un session ya se encuentra activa' ||
      session.token === 'Credenciales invalidas'
    ) {
      return;
    } else {
      this.localStorageService.setItem('tk', session.token);
      this.localStorageService.setItem('exp', session.expire);
      this.localStorageService.setItem('rfs', session.refresh);
      this.localStorageService.setItem('prfl', session.prfl);
    }
  }

  loadSessionData(): Session {
    if (this.cookieStorage.check('ruc')) {
      return {
        user: { ruc: this.cookieStorage.get('ruc') },
        isAuthenticate: false,
        token: null,
      };
    }
    return null;
  }

  getCurrentSession(): Session {
    if (this.currentSession === null || this.currentSession === undefined) {
      const tk = this.localStorageService.getItem('tk');
      this.currentSession = {
        user: { ruc: '' },
        isAuthenticate: tk !== null && tk !== undefined && tk !== '',
        token: tk,
        expire: this.localStorageService.getItem('exp'),
        refresh: this.localStorageService.getItem('rfs'),
      };
    }
    return this.currentSession;
  }

  isValidSession(): boolean {
    return this.isAuthenticated() && this.getPerfil().toString() === '0';
  }

  removeCurrentSession(): void {
    this.localStorageService.removeItem('tk');
    this.localStorageService.removeItem('exp');
    this.localStorageService.removeItem('rfs');
    this.currentSession = null;
  }

  getCurrentUser(): User {
    const session: Session = this.getCurrentSession();
    return session && session.user ? session.user : null;
  }

  isAuthenticated(): boolean {
    return this.currentSession && this.currentSession.isAuthenticate;
  }

  getCurrentToken(): string {
    const session = this.getCurrentSession();
    return session && session.token ? session.token : null;
  }

  setIntentos(intentos: number): void {
    this.localStorageService.setItem('intento', intentos);
  }

  getIntentos(): number {
    return this.localStorageService.getItem('intento');
  }

  getPerfil(): number {
    return this.localStorageService.getItem('prfl');
  }
}
