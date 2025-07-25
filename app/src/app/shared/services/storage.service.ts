import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

import { companyDocumentStorageName } from '../constants/company';
import { type Session } from '../models/session.model';
import { type User } from '../models/user.model';

@Injectable()
export class StorageService {
  private readonly sessionStorageService: Storage;
  private currentSession: Session = null;

  constructor(private readonly cookieStorage: CookieService) {
    this.sessionStorageService = window.sessionStorage;
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
      this.sessionStorageService.setItem('tk', session.token);
      this.sessionStorageService.setItem('exp', session.expire);
      this.sessionStorageService.setItem('rfs', session.refresh);
      this.sessionStorageService.setItem('prfl', String(session.prfl));
    }
  }

  loadSessionData(): Session {
    if (this.cookieStorage.check(companyDocumentStorageName)) {
      return {
        user: { ruc: this.cookieStorage.get(companyDocumentStorageName) },
        isAuthenticate: false,
        token: null,
      };
    }
    return null;
  }

  getCurrentSession(): Session {
    if (this.currentSession === null || this.currentSession === undefined) {
      const tk = this.sessionStorageService.getItem('tk');
      this.currentSession = {
        user: { ruc: '' },
        isAuthenticate: tk !== null && tk !== undefined && tk !== '',
        token: tk,
        expire: this.sessionStorageService.getItem('exp'),
        refresh: this.sessionStorageService.getItem('rfs'),
      };
    }
    return this.currentSession;
  }

  isValidSession(): boolean {
    return this.isAuthenticated() && this.getPerfil() === '0';
  }

  removeCurrentSession(): void {
    this.sessionStorageService.removeItem('tk');
    this.sessionStorageService.removeItem('exp');
    this.sessionStorageService.removeItem('rfs');
    this.currentSession = null;
  }

  getCurrentUser(): User {
    const session: Session = this.getCurrentSession();
    return session?.user ?? null;
  }

  isAuthenticated(): boolean {
    return this.currentSession?.isAuthenticate;
  }

  getPerfil() {
    return this.sessionStorageService.getItem('prfl');
  }
}
