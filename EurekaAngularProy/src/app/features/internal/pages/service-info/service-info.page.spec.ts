import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockComponent } from 'ng-mocks';

import { ServicesFormsService } from '../../../../shared/services';
import { StorageService } from '../../../../shared/services/storage.service';
import { ServiceInfoPage } from './service-info.page';

describe('ServiceInfoPage', () => {
  let component: ServiceInfoPage;
  let fixture: ComponentFixture<ServiceInfoPage>;

  beforeEach(() => {
    void TestBed.configureTestingModule({
      declarations: [MockComponent(ServiceInfoPage)],
      imports: [RouterTestingModule],
      providers: [ServicesFormsService, StorageService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceInfoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
