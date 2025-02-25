import { HttpClientTestingModule } from '@angular/common/http/testing';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { MockProvider } from 'ng-mocks';

import { AfiliacionService } from '../../shared/services/afiliacion.service';
import { ExcelService } from '../../shared/services/excel.service';
import { LoginService } from '../../shared/services/login.service';
import { NotifyService } from '../../shared/services/notify.service';
import { StorageService } from '../../shared/services/storage.service';
import { InternalComponent } from './internal.component';

describe('InternalComponent', () => {
  let component: InternalComponent;
  let fixture: ComponentFixture<InternalComponent>;

  beforeEach(() => {
    void TestBed.configureTestingModule({
      providers: [
        MockProvider(NotifyService),
        ExcelService,
        MockProvider(AfiliacionService),
        MockProvider(LoginService),
        StorageService,
        MockProvider(ActivatedRoute),
      ],
      imports: [HttpClientTestingModule, BrowserAnimationsModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
