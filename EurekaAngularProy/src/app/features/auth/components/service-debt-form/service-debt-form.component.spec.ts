import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceDebtFormComponent } from './service-debt-form.component';

describe('ServiceDebtFormComponent', () => {
  let component: ServiceDebtFormComponent;
  let fixture: ComponentFixture<ServiceDebtFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceDebtFormComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceDebtFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
