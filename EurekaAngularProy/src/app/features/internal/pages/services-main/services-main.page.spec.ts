import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MockProvider } from 'ng-mocks';

import { ServicesFormsService } from '../../../../shared/services';
import { CompanyServicesService } from '../../services';
import { ServicesMainPage } from './services-main.page';

describe('ServicesMainPage', () => {
  let component: ServicesMainPage;
  let fixture: ComponentFixture<ServicesMainPage>;

  beforeEach(() => {
    void TestBed.configureTestingModule({
      declarations: [ServicesMainPage],
      imports: [RouterTestingModule],
      providers: [MockProvider(CompanyServicesService), ServicesFormsService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesMainPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
