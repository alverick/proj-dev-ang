import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CompanyFormRegistrationComponent } from './company-form-registration.component';

describe('CompanyFormRegistrationComponent', () => {
  let component: CompanyFormRegistrationComponent;
  let fixture: ComponentFixture<CompanyFormRegistrationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyFormRegistrationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyFormRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
