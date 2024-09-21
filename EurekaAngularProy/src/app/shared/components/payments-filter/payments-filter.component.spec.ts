import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MockBuilder, MockRender } from 'ng-mocks';

import { PaymentsFilterComponent } from './payments-filter.component';

describe('PaymentsFilterComponent', () => {
  beforeEach(() =>
    MockBuilder(PaymentsFilterComponent)
      .mock(MatFormFieldModule)
      .mock(MatSelectModule)
      .mock(MatIconModule)
      .mock(MatDatepickerModule)
      .mock(FormsModule)
      .mock(ReactiveFormsModule)
  );

  it('should create', () => {
    const fixture = MockRender(PaymentsFilterComponent);
    expect(fixture).toBeTruthy();
  });
});
