import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InternalAuthComponent } from './internal-auth.component';

describe('InternalAuthComponent', () => {
  let component: InternalAuthComponent;
  let fixture: ComponentFixture<InternalAuthComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
