import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UpdateCompanyPage } from './update-company.page';

describe('UpdateCompanyComponent', () => {
  let component: UpdateCompanyPage;
  let fixture: ComponentFixture<UpdateCompanyPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateCompanyPage],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateCompanyPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
