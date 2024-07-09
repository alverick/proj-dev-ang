import { HttpClientTestingModule } from '@angular/common/http/testing';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { MockProvider } from 'ng-mocks';

import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { AfiliacionService } from '../../../../shared/services/afiliacion.service';
import { ExcelService } from '../../../../shared/services/excel.service';
import { LoginService } from '../../../../shared/services/login.service';
import { NotifyService } from '../../../../shared/services/notify.service';
import { StorageService } from '../../../../shared/services/storage.service';
import { InternalHeaderComponent } from './internal-header.component';

describe('InternalHeaderComponent', () => {
  let component: InternalHeaderComponent;
  let fixture: ComponentFixture<InternalHeaderComponent>;

  beforeEach(() => {
    void TestBed.configureTestingModule({
      declarations: [InternalHeaderComponent],
      imports: [
        HeaderComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        NoopAnimationsModule,
      ],
      providers: [
        AfiliacionService,
        ExcelService,
        NotifyService,
        MockProvider(LoginService),
        StorageService,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
