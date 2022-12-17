import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RegistrationFinishedPage } from './registration-finished.page';

describe('RegistrationFinishedPage', () => {
  let component: RegistrationFinishedPage;
  let fixture: ComponentFixture<RegistrationFinishedPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrationFinishedPage],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationFinishedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
