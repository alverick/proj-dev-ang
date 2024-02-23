import { TestBed } from '@angular/core/testing';

import {
  type Satellite,
  AdobeLaunchProviderService,
} from './adobe-launch-provider.service';

describe('AdobeLaunchProviderService', () => {
  let service: AdobeLaunchProviderService;
  const _satellite: Partial<Satellite> = {
    track: () => {
      console.log('addPageAction');
    },
  };

  const newRelicActionOrig = _satellite.track;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [AdobeLaunchProviderService] });
    service = TestBed.inject(AdobeLaunchProviderService);
  });

  afterEach(() => {
    _satellite.track = newRelicActionOrig;
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
    // expect(mockedTrackPage).toBeCalled();
  });
});
