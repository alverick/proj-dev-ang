import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacySelectModule } from '@angular/material/legacy-select';
import { MockBuilder, MockRender } from 'ng-mocks';

import { PaymentsFilterComponent } from './payments-filter.component';

describe('PaymentsFilterComponent', () => {
  beforeEach(() =>
    MockBuilder(PaymentsFilterComponent)
      .mock(MatLegacyFormFieldModule)
      .mock(MatLegacySelectModule)
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
