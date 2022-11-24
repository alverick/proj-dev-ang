import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceStepInfoComponent } from './service-step-info.component';

describe('ServiceStepInfoComponent', () => {
  let component: ServiceStepInfoComponent;
  let fixture: ComponentFixture<ServiceStepInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceStepInfoComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceStepInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
