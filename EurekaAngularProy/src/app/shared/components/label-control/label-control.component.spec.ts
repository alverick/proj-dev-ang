import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LabelControlComponent } from './label-control.component';

describe('LabelControlComponent', () => {
  let component: LabelControlComponent;
  let fixture: ComponentFixture<LabelControlComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [LabelControlComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabelControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
