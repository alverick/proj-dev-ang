import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CompanyServicesPage } from './company-services.page';

describe('CompanyServicesPage', () => {
  let component: CompanyServicesPage;
  let fixture: ComponentFixture<CompanyServicesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyServicesPage],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyServicesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
