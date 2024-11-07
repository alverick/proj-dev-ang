import type { AdobeEventType, TrackEventProperties } from './tracking.service';

export abstract class ProviderService {
  abstract startTracking(): void;
  abstract trackPage(payload: Partial<TrackEventProperties>): void;

  abstract trackEvent(
    event: AdobeEventType,
    payload: Partial<TrackEventProperties>,
  ): void;
}
