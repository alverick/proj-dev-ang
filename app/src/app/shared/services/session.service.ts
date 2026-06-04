import { inject, Injectable } from '@angular/core';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Subject, Subscription, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private readonly idle = inject(Idle);

  private readonly SESSION_DURATION_MINUTES = 15;
  private readonly DEFAULT_TIMEOUT = 60;
  private readonly DEFAULT_IDLE =
    this.SESSION_DURATION_MINUTES * 60 - this.DEFAULT_TIMEOUT;

  public readonly requestBackendTokenRefresh$: Subject<void> =
    new Subject<void>();
  public readonly sessionTimedOut$: Subject<void> = new Subject<void>();
  public readonly sessionWarning$: Subject<number> = new Subject<number>();

  private idleStartSubscription?: Subscription;
  private idleEndSubscription?: Subscription;
  private tokenRefreshSubscription?: Subscription;
  private visualCountdownSubscription?: Subscription;

  constructor() {
    this.setupIdleEventListeners();
  }

  public startTracking(tokenExpirationIso: string): void {
    this.stopTracking();

    this.updateUiExpiration(this.SESSION_DURATION_MINUTES * 60);

    this.idle.setIdle(this.DEFAULT_IDLE);
    this.idle.setTimeout(this.DEFAULT_TIMEOUT);
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);
    this.idle.watch();

    this.scheduleNextBackgroundRefresh(tokenExpirationIso);

  }

  public rescueUiSession(): void {
    this.visualCountdownSubscription?.unsubscribe();

    this.updateUiExpiration(this.SESSION_DURATION_MINUTES * 60);
    this.idle.watch();

  }

  public scheduleNextBackgroundRefresh(tokenExpirationIso: string): void {
    this.tokenRefreshSubscription?.unsubscribe();

    const expirationTime = new Date(tokenExpirationIso).getTime();
    const currentTime = Date.now();
    const bufferSeconds = 30;

    const secondsUntilRefresh =
      Math.floor((expirationTime - currentTime) / 1000) - bufferSeconds;

    if (secondsUntilRefresh > 0) {

      this.tokenRefreshSubscription = timer(
        secondsUntilRefresh * 1000,
      ).subscribe(() => {
        this.requestBackendTokenRefresh$.next();
      });
    } else {
      this.requestBackendTokenRefresh$.next();
    }
  }

  public stopTracking(): void {
    this.idle.stop();
    this.tokenRefreshSubscription?.unsubscribe();
    this.visualCountdownSubscription?.unsubscribe();
  }

  public destroyService(): void {
    this.stopTracking();
    this.unsubscribeEventListeners();
  }

  private startVisualCountdown(): void {
    this.visualCountdownSubscription?.unsubscribe();

    const targetEvictionTime = Date.now() + this.DEFAULT_TIMEOUT * 1000;

    this.sessionWarning$.next(this.DEFAULT_TIMEOUT);

    this.visualCountdownSubscription = timer(1000, 1000).subscribe(() => {
      const currentTime = Date.now();

      const secondsLeft = Math.ceil((targetEvictionTime - currentTime) / 1000);

      if (secondsLeft > 0) {
        this.sessionWarning$.next(secondsLeft);
      } else {
        this.visualCountdownSubscription?.unsubscribe();
        this.sessionTimedOut$.next();
      }
    });
  }

  private updateUiExpiration(durationInSeconds: number): void {
    const uiExpirationTime = Date.now() + durationInSeconds * 1000;
    sessionStorage.setItem('ui_exp', new Date(uiExpirationTime).toISOString());
  }

  private setupIdleEventListeners(): void {
    this.idleStartSubscription = this.idle.onIdleStart.subscribe(() => {
      this.updateUiExpiration(this.DEFAULT_TIMEOUT);
      this.startVisualCountdown();
    });

    this.idleEndSubscription = this.idle.onIdleEnd.subscribe(() => {
      if (this.visualCountdownSubscription) {
        return;
      }

      this.updateUiExpiration(this.SESSION_DURATION_MINUTES * 60);
    });
  }

  private unsubscribeEventListeners(): void {
    this.idleStartSubscription?.unsubscribe();
    this.idleEndSubscription?.unsubscribe();
  }
}
