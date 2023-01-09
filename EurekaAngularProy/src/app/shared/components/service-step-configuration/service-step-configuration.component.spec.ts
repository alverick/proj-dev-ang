import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceStepConfigurationComponent } from './service-step-configuration.component';

describe('ServiceStepConfigurationComponent', () => {
  let component: ServiceStepConfigurationComponent;
  let fixture: ComponentFixture<ServiceStepConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceStepConfigurationComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceStepConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
