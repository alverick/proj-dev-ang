import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { MultiSelectModule } from 'primeng/multiselect';

import { LabelControlComponent } from '../../../../shared/components/label-control/label-control.component';
import { DashboardFilterComponent } from './dashboard-filter.component';

describe('DashboardFilterComponent', () => {
  let component: DashboardFilterComponent;
  let fixture: ComponentFixture<DashboardFilterComponent>;

  beforeEach(() => {
    void TestBed.configureTestingModule({
      declarations: [DashboardFilterComponent, LabelControlComponent],
      imports: [
        CalendarModule,
        DropdownModule,
        FormsModule,
        ReactiveFormsModule,
        MultiSelectModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
