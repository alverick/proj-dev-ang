import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ServiceAddPage } from './service-add.page';

describe('ServiceAddPage', () => {
  let component: ServiceAddPage;
  let fixture: ComponentFixture<ServiceAddPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ServiceAddPage],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
