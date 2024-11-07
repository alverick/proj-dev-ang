import { TestBed } from '@angular/core/testing';

import {
  AdobeLaunchProviderService,
  type Satellite,
} from './adobe-launch-provider.service';
import { StorageService } from './storage.service';
import { AdobeEvent } from './tracking.service';

declare const window: {
  _satellite: Partial<Satellite>;
} & Window;

describe('AdobeLaunchProviderService', () => {
  let service: AdobeLaunchProviderService;
  const _satellite: Partial<Satellite> = {
    track: () => {
      console.log('track');
    },
  };

  window._satellite = _satellite;

  const mockedTrackPage = jest.fn();
  const adobeActionOrig = _satellite.track;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdobeLaunchProviderService, StorageService],
    });
    service = TestBed.inject(AdobeLaunchProviderService);
    _satellite.track = mockedTrackPage;
  });

  afterEach(() => {
    _satellite.track = adobeActionOrig;
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
    expect(mockedTrackPage).toHaveBeenCalledWith(AdobeEvent.pageTrack, payload);
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
    expect(mockedTrackPage).toHaveBeenCalledWith(
      AdobeEvent.trackFormSubmit,
      payload,
    );
  });
});
