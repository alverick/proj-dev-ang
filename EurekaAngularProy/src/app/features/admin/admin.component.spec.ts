import { HttpClientTestingModule } from '@angular/common/http/testing';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { HeaderComponent } from '../../shared/components/header/header.component';
import { ExcelService } from '../../shared/services/excel.service';
import { NotifyService } from '../../shared/services/notify.service';
import { AdminComponent } from './admin.component';
import { AdminHeaderComponent } from './components/admin-header/admin-header.component';

describe('AdminComponent', () => {
  let component: AdminComponent;
  let fixture: ComponentFixture<AdminComponent>;

  beforeEach(() => {
    void TestBed.configureTestingModule({
      declarations: [AdminComponent, AdminHeaderComponent, HeaderComponent],
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [ExcelService, NotifyService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
