import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CompanyConfigurationPage } from './company-configuration.page';

describe('CompanyConfigurationPage', () => {
  let component: CompanyConfigurationPage;
  let fixture: ComponentFixture<CompanyConfigurationPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyConfigurationPage],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyConfigurationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
