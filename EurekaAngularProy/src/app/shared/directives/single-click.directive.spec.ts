import { TestBed } from '@angular/core/testing';

import { SingleClickDirective } from './single-click.directive';

describe('SingleClickDirective', () => {
  it('should create an instance', () => {
    let directive: SingleClickDirective;
    TestBed.runInInjectionContext(() => {
      directive = new SingleClickDirective();
    });
    expect(directive).toBeTruthy();
  });
});
