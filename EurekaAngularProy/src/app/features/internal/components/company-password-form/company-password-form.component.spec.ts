import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CompanyPasswordFormComponent } from './company-password-form.component';

describe('CompanyPasswordFormComponent', () => {
  let component: CompanyPasswordFormComponent;
  let fixture: ComponentFixture<CompanyPasswordFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyPasswordFormComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyPasswordFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
