import { TestBed } from '@angular/core/testing';

import { environment } from '../../../environments/environment';
import { ScriptInjectorService } from './script-injector.service';

describe('ScriptInjectorService', () => {
  let service: ScriptInjectorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScriptInjectorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('load script', (done) => {
    service.loadScript('Launch', environment.adobe);
    setTimeout(() => {
      done();
    }, 4000);
  });
});
