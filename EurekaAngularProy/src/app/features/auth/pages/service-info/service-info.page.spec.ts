import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ServiceInfoPage } from './service-info.page';

describe('ServiceInfoPage', () => {
  let component: ServiceInfoPage;
  let fixture: ComponentFixture<ServiceInfoPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceInfoPage],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
