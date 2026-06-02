import { TestBed } from '@angular/core/testing';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { Subject, Subscription } from 'rxjs';

import { SessionService } from './session.service';

describe('SessionService', () => {
  let service: SessionService;
  let idleMock: {
    onIdleStart: Subject<void>;
    onIdleEnd: Subject<void>;
    setIdle: jest.Mock;
    setTimeout: jest.Mock;
    setInterrupts: jest.Mock;
    watch: jest.Mock;
    stop: jest.Mock;
  };

  const mockSessionStorage = (() => {
    let store: { [key: string]: string } = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => (store[key] = value),
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => (store = {}),
    };
  })();

  beforeAll(() => {
    Object.defineProperty(window, 'sessionStorage', {
      value: mockSessionStorage,
      writable: true,
    });
  });

  beforeEach(() => {
    mockSessionStorage.clear();
    jest.useFakeTimers();

    idleMock = {
      onIdleStart: new Subject<void>(),
      onIdleEnd: new Subject<void>(),
      setIdle: jest.fn(),
      setTimeout: jest.fn(),
      setInterrupts: jest.fn(),
      watch: jest.fn(),
      stop: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [SessionService, { provide: Idle, useValue: idleMock }],
    });

    service = TestBed.inject(SessionService);

    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.restoreAllMocks();
    jest.useRealTimers();
    if (service) {
      service.destroyService();
    }
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('constructor', () => {
    it('should initialize subscriptions', () => {
      // Access private properties using bracket notation
      expect((service as any)['idleStartSubscription']).toBeInstanceOf(
        Subscription,
      );
      expect((service as any)['idleEndSubscription']).toBeInstanceOf(
        Subscription,
      );
    });
  });

  describe('startTracking', () => {
    it('should stop previous tracking, update UI expiration, set idle properties, and watch idle', () => {
      const stopTrackingSpy = jest.spyOn(service, 'stopTracking');
      // Access private methods/properties using bracket notation or 'as any' for spying
      const updateUiExpirationSpy = jest.spyOn(
        service as any,
        'updateUiExpiration',
      );
      const scheduleNextBackgroundRefreshSpy = jest.spyOn(
        service,
        'scheduleNextBackgroundRefresh',
      );

      const tokenExpiration = new Date(
        Date.now() + 60 * 60 * 1000,
      ).toISOString();
      service.startTracking(tokenExpiration);

      expect(stopTrackingSpy).toHaveBeenCalled();
      expect(updateUiExpirationSpy).toHaveBeenCalledWith(
        (service as any)['SESSION_DURATION_MINUTES'] * 60,
      );
      expect(idleMock.setIdle).toHaveBeenCalledWith(
        (service as any)['DEFAULT_IDLE'],
      );
      expect(idleMock.setTimeout).toHaveBeenCalledWith(
        (service as any)['DEFAULT_TIMEOUT'],
      );
      expect(idleMock.setInterrupts).toHaveBeenCalledWith(
        DEFAULT_INTERRUPTSOURCES,
      );
      expect(idleMock.watch).toHaveBeenCalled();
      expect(scheduleNextBackgroundRefreshSpy).toHaveBeenCalledWith(
        tokenExpiration,
      );
    });
  });

  describe('rescueUiSession', () => {
    it('should unsubscribe visual countdown, update UI expiration, and watch idle', () => {
      // Simulate visual countdown being active before rescueUiSession is called
      (service as any)['visualCountdownSubscription'] = new Subscription();
      const visualCountdownUnsubscribeSpy = jest.spyOn(
        (service as any)['visualCountdownSubscription'] as Subscription,
        'unsubscribe',
      );

      const updateUiExpirationSpy = jest.spyOn(
        service as any,
        'updateUiExpiration',
      );

      service.rescueUiSession();

      expect(visualCountdownUnsubscribeSpy).toHaveBeenCalled();
      expect(updateUiExpirationSpy).toHaveBeenCalledWith(
        (service as any)['SESSION_DURATION_MINUTES'] * 60,
      );
      expect(idleMock.watch).toHaveBeenCalled();
    });
  });

  describe('scheduleNextBackgroundRefresh', () => {
    let requestBackendTokenRefreshSpy: jest.SpyInstance;

    beforeEach(() => {
      requestBackendTokenRefreshSpy = jest.spyOn(
        service.requestBackendTokenRefresh$,
        'next',
      );
    });

    it('should schedule a token refresh if secondsUntilRefresh is positive', () => {
      const futureExpiration = new Date(
        Date.now() + 5 * 60 * 1000,
      ).toISOString();
      service.scheduleNextBackgroundRefresh(futureExpiration);

      expect(requestBackendTokenRefreshSpy).not.toHaveBeenCalled();

      jest.advanceTimersByTime(269 * 1000);
      expect(requestBackendTokenRefreshSpy).not.toHaveBeenCalled();

      jest.advanceTimersByTime(1 * 1000);
      expect(requestBackendTokenRefreshSpy).toHaveBeenCalledTimes(1);
    });

    it('should immediately request token refresh if secondsUntilRefresh is zero or negative', () => {
      const pastExpiration = new Date(Date.now() - 60 * 1000).toISOString();
      service.scheduleNextBackgroundRefresh(pastExpiration);

      expect(requestBackendTokenRefreshSpy).toHaveBeenCalledTimes(1);
      jest.runOnlyPendingTimers();
      expect(requestBackendTokenRefreshSpy).toHaveBeenCalledTimes(1);
    });

    it('should unsubscribe previous token refresh subscription', () => {
      (service as any)['tokenRefreshSubscription'] = new Subscription();
      const unsubscribeSpy = jest.spyOn(
        (service as any)['tokenRefreshSubscription'] as Subscription,
        'unsubscribe',
      );

      const initialExpiration = new Date(
        Date.now() + 5 * 60 * 1000,
      ).toISOString();
      service.scheduleNextBackgroundRefresh(initialExpiration);

      expect(unsubscribeSpy).toHaveBeenCalled();
    });
  });

  describe('stopTracking', () => {
    it('should call idle.stop and unsubscribe all tracking subscriptions', () => {
      const idleStopSpy = jest.spyOn(idleMock, 'stop');

      (service as any)['tokenRefreshSubscription'] = new Subscription();
      (service as any)['visualCountdownSubscription'] = new Subscription();

      const tokenRefreshUnsubscribeSpy = jest.spyOn(
        (service as any)['tokenRefreshSubscription'] as Subscription,
        'unsubscribe',
      );
      const visualCountdownUnsubscribeSpy = jest.spyOn(
        (service as any)['visualCountdownSubscription'] as Subscription,
        'unsubscribe',
      );

      service.stopTracking();

      expect(idleStopSpy).toHaveBeenCalled();
      expect(tokenRefreshUnsubscribeSpy).toHaveBeenCalled();
      expect(visualCountdownUnsubscribeSpy).toHaveBeenCalled();
    });
  });

  describe('destroyService', () => {
    it('should call stopTracking and unsubscribe event listeners', () => {
      const unsubscribeEventListenersSpy = jest.spyOn(
        service as any,
        'unsubscribeEventListeners',
      );
      const stopTrackingSpy = jest.spyOn(service, 'stopTracking');

      service.destroyService();

      expect(stopTrackingSpy).toHaveBeenCalled();
      expect(unsubscribeEventListenersSpy).toHaveBeenCalled();
    });
  });

  describe('Idle Event Listeners', () => {
    let sessionWarningNextSpy: jest.SpyInstance;
    let sessionTimedOutNextSpy: jest.SpyInstance;

    beforeEach(() => {
      sessionWarningNextSpy = jest.spyOn(service.sessionWarning$, 'next');
      sessionTimedOutNextSpy = jest.spyOn(service.sessionTimedOut$, 'next');
    });

    it('onIdleStart should start visual countdown and update UI expiration', () => {
      const startVisualCountdownSpy = jest.spyOn(
        service as any,
        'startVisualCountdown',
      );
      const updateUiExpirationSpy = jest.spyOn(
        service as any,
        'updateUiExpiration',
      );

      idleMock.onIdleStart.next(undefined);

      expect(updateUiExpirationSpy).toHaveBeenCalledWith(
        (service as any)['DEFAULT_TIMEOUT'],
      );
      expect(startVisualCountdownSpy).toHaveBeenCalled();
      expect(sessionWarningNextSpy).toHaveBeenCalledWith(
        (service as any)['DEFAULT_TIMEOUT'],
      );
    });

    it('onIdleEnd should update UI expiration if visual countdown is not active', () => {
      const updateUiExpirationSpy = jest.spyOn(
        service as any,
        'updateUiExpiration',
      );
      (service as any)['visualCountdownSubscription'] = undefined; // Ensure no active countdown

      idleMock.onIdleEnd.next(undefined);

      expect(updateUiExpirationSpy).toHaveBeenCalledWith(
        (service as any)['SESSION_DURATION_MINUTES'] * 60,
      );
    });

    it('onIdleEnd should not update UI expiration if visual countdown is active', () => {
      const updateUiExpirationSpy = jest.spyOn(
        service as any,
        'updateUiExpiration',
      );
      (service as any)['visualCountdownSubscription'] = new Subscription(); // Simulate active countdown

      idleMock.onIdleEnd.next(undefined);

      expect(updateUiExpirationSpy).not.toHaveBeenCalled();
    });

    it('startVisualCountdown should emit sessionWarning$ and sessionTimedOut$ correctly', () => {
      const initialTimeout = (service as any)['DEFAULT_TIMEOUT']; // 30 seconds

      idleMock.onIdleStart.next(undefined);
      expect(sessionWarningNextSpy).toHaveBeenCalledWith(initialTimeout); // Initial emission

      jest.advanceTimersByTime(1000);
      expect(sessionWarningNextSpy).toHaveBeenCalledWith(initialTimeout - 1);

      jest.advanceTimersByTime((initialTimeout - 2) * 1000);
      expect(sessionWarningNextSpy).toHaveBeenCalledWith(1);

      jest.advanceTimersByTime(1000);
      expect(sessionTimedOutNextSpy).toHaveBeenCalledTimes(1);
      expect((service as any)['visualCountdownSubscription']?.closed).toBe(
        true,
      );
    });

    it('startVisualCountdown should immediately evict if time already passed', () => {
      const initialTimeout = (service as any)['DEFAULT_TIMEOUT']; // 30 seconds
      const now = new Date(2026, 4, 26, 10, 0, 0).getTime();
      jest.setSystemTime(now);

      idleMock.onIdleStart.next(undefined);

      expect(sessionWarningNextSpy).toHaveBeenCalledWith(initialTimeout);

      jest.advanceTimersByTime(initialTimeout * 1000 + 1);

      expect(sessionTimedOutNextSpy).toHaveBeenCalledTimes(1);
      expect((service as any)['visualCountdownSubscription']?.closed).toBe(
        true,
      );
    });
  });

  describe('updateUiExpiration', () => {
    it('should set ui_exp in sessionStorage', () => {
      const duration = 60 * 15; // 15 minutes
      (service as any)['updateUiExpiration'](duration);
      expect(mockSessionStorage.getItem('ui_exp')).not.toBeNull();

      const storedDate = new Date(mockSessionStorage.getItem('ui_exp'));
      const expectedDate = new Date(Date.now() + duration * 1000);
      expect(storedDate.getTime()).toBeCloseTo(expectedDate.getTime(), -3); // Within milliseconds
    });
  });
});
