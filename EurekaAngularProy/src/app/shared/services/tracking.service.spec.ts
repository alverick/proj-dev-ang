import { TestBed } from '@angular/core/testing';

import { StorageService } from './storage.service';
import { AdobeEvent, TrackingService } from './tracking.service';

describe('TrackingService', () => {
  let service: TrackingService;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [StorageService] });
    service = TestBed.inject(TrackingService);
  });

  it('should be created', () => {
    void expect(service).toBeTruthy();
  });

  it('set ruc', () => {
    const ruc = '10293726253';
    service.setRuc(ruc);
    void expect(service.payload.user.codRuc).toEqual(ruc);
  });

  it('track event view', (done) => {
    const eventProperties = { category: 'category' };
    service.eventSubject$.subscribe(({ event, payload }) => {
      void expect(event).toEqual(AdobeEvent.trackView);
      void expect(payload.view).toEqual(eventProperties);
      done();
    });
    service.trackEvent(AdobeEvent.trackView, eventProperties);
  });

  it('track event action', (done) => {
    const eventProperties = { category: 'category' };
    service.eventSubject$.subscribe(({ event, payload }) => {
      void expect(event).toEqual(AdobeEvent.trackAction);
      void expect(payload.action).toEqual(eventProperties);
      done();
    });
    service.trackEvent(AdobeEvent.trackAction, eventProperties);
  });

  it('track page', (done) => {
    service.pageSubject$.subscribe((payload) => {
      expect(payload.page).toEqual(
        expect.objectContaining({ name: 'cs:login' })
      );
      done();
    });
    service.trackPage('/login');
  });
});
