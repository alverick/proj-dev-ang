import { type ComponentFixture, TestBed } from '@angular/core/testing';

import { NotEmptyPipe } from '../../../../shared/pipes/not-empty.pipe';
import { DashboardCardComponent } from './dashboard-card.component';

describe('DashboardCardComponent', () => {
  let component: DashboardCardComponent;
  let fixture: ComponentFixture<DashboardCardComponent>;

  beforeEach(() => {
    void TestBed.configureTestingModule({
      declarations: [DashboardCardComponent],
      imports: [NotEmptyPipe],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
