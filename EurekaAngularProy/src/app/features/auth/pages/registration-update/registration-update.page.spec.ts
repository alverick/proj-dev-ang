import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RegistrationUpdatePage } from './registration-update.page';

describe('RegistrationUpdateComponent', () => {
  let component: RegistrationUpdatePage;
  let fixture: ComponentFixture<RegistrationUpdatePage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrationUpdatePage],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationUpdatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
