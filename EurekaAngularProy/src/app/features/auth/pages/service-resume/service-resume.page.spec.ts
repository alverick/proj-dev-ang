import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ServiceResumePage } from './service-resume.page';

describe('ServiceListPage', () => {
  let component: ServiceResumePage;
  let fixture: ComponentFixture<ServiceResumePage>;

  beforeEach(waitForAsync(() => {
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
