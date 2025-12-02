import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { PaymentsFilterComponent } from './payments-filter.component';

describe('PaymentsFilterComponent', () => {
  let component: PaymentsFilterComponent;
  let fixture: ComponentFixture<PaymentsFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentsFilterComponent, NoopAnimationsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentsFilterComponent);
    component = fixture.componentInstance;

    fixture.componentRef.setInput('gtpMode', false);
    fixture.componentRef.setInput('dateList', []);
    fixture.componentRef.setInput('stateTypeList', []);
    fixture.componentRef.setInput('multipleState', false);
    fixture.componentRef.setInput('services', []);
    fixture.componentRef.setInput('stateList', []);
    fixture.componentRef.setInput('initial', undefined);
    fixture.componentRef.setInput('resetFilters', undefined);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
