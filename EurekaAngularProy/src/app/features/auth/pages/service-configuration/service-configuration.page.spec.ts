import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceConfigurationPage } from './service-configuration.page';

describe('ServiceConfigurationPage', () => {
  let component: ServiceConfigurationPage;
  let fixture: ComponentFixture<ServiceConfigurationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceConfigurationPage],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceConfigurationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
