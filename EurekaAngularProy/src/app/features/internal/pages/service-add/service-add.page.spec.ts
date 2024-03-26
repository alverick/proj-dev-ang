import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { MockComponent } from 'ng-mocks';

import { ServiceAddPage } from './service-add.page';

describe('ServiceAddPage', () => {
  let component: ServiceAddPage;
  let fixture: ComponentFixture<ServiceAddPage>;

  beforeEach(() => {
    void TestBed.configureTestingModule({
      declarations: [MockComponent(ServiceAddPage)],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
