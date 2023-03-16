import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CompanyFormAuthComponent } from './company-form-auth.component';

describe('CompanyFormAuthComponent', () => {
  let component: CompanyFormAuthComponent;
  let fixture: ComponentFixture<CompanyFormAuthComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyFormAuthComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyFormAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
