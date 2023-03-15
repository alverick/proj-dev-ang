import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CompanyUpdateFormComponent } from './company-update-form.component';

describe('CompanyUpdateFormComponent', () => {
  let component: CompanyUpdateFormComponent;
  let fixture: ComponentFixture<CompanyUpdateFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyUpdateFormComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyUpdateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
