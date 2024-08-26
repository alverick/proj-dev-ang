import { TestBed } from '@angular/core/testing';
import type { BrowserAgent } from '@newrelic/browser-agent/loaders/browser-agent';
import dot from 'dot-object';

import { NewRelicProviderService } from './new-relic-provider.service';
import { StorageService } from './storage.service';
import { AdobeEvent } from './tracking.service';

declare const window: {
  newrelic: Partial<BrowserAgent>;
} & Window;

describe('NewRelicProviderService', () => {
  let service: NewRelicProviderService;
  const newrelic = {
    addPageAction: () => {
      console.log('addPageAction');
    },
  };
  window.newrelic = newrelic;
  const mockedTrackPage = jest.fn();
  const newRelicActionOrig = window.newrelic.addPageAction;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NewRelicProviderService, StorageService],
    });
    service = TestBed.inject(NewRelicProviderService);
    window.newrelic.addPageAction = mockedTrackPage;
  });

  afterEach(() => {
    window.newrelic.addPageAction = newRelicActionOrig;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('track page', () => {
    const payload = {
      user: {
        codEmpresa: '',
        codGrupo: '',
        codRuc: '',
        digitalId: '',
        userId: '',
      },
    };
    service.trackPage(payload);
    expect(mockedTrackPage).toBeCalled();
    expect(mockedTrackPage).toHaveBeenCalledWith(
      AdobeEvent.pageTrack,
      dot.dot(payload)
    );
  });

  it('track event', () => {
    const payload = {
      user: {
        codEmpresa: '',
        codGrupo: '',
        codRuc: '',
        digitalId: '',
        userId: '',
      },
      action: {
        state: 'state test',
        metadata: [
          {
            key: 'key',
            value: 'value',
          },
        ],
      },
    };
    service.trackEvent(AdobeEvent.trackFormSubmit, payload);
    expect(mockedTrackPage).toBeCalled();
    expect(mockedTrackPage).toHaveBeenCalledWith(AdobeEvent.trackFormSubmit, {
      key: 'value',
      state: 'state test',
    });
  });
});
