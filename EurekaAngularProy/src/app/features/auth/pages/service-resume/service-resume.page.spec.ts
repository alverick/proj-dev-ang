import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceResumePage } from './service-resume.page';

describe('ServiceListPage', () => {
  let component: ServiceResumePage;
  let fixture: ComponentFixture<ServiceResumePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceResumePage],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceResumePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
