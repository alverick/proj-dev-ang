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
    void service.load('Launch', environment.adobe).then((result) => {
      console.log('load script', result);
      done();
    });
    setTimeout(() => {
      console.log('timeout', service);
      done();
    }, 4000);
  });
});
