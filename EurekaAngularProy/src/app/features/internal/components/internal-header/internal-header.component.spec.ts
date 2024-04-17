import { HttpClientTestingModule } from '@angular/common/http/testing';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { HeaderComponent } from '../../../../shared/components/header/header.component';
import { AfiliacionService } from '../../../../shared/services/afiliacion.service';
import { ExcelService } from '../../../../shared/services/excel.service';
import { NotifyService } from '../../../../shared/services/notify.service';
import { InternalHeaderComponent } from './internal-header.component';

describe('InternalHeaderComponent', () => {
  let component: InternalHeaderComponent;
  let fixture: ComponentFixture<InternalHeaderComponent>;

  beforeEach(() => {
    void TestBed.configureTestingModule({
      declarations: [HeaderComponent, InternalHeaderComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AfiliacionService, ExcelService, NotifyService],
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
