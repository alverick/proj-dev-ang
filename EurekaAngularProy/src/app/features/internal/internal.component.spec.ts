import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { InternalComponent } from './internal.component';

describe('InternalComponent', () => {
  let component: InternalComponent;
  let fixture: ComponentFixture<InternalComponent>;

  beforeEach(() => {
    void TestBed.configureTestingModule({
      declarations: [MockComponent(InternalComponent)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
