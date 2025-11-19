import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockBuilder, MockRender } from 'ng-mocks';
import { DatePickerModule } from 'primeng/datepicker';
import { IconField } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { SelectModule } from 'primeng/select';

import { LabelControlComponent } from '../label-control/label-control.component';
import { PaymentsFilterComponent } from './payments-filter.component';

describe('PaymentsFilterComponent', () => {
  beforeEach(() =>
    MockBuilder(PaymentsFilterComponent)
      .mock(FormsModule)
      .mock(IconField)
      .mock(InputIconModule)
      .mock(SelectModule)
      .mock(DatePickerModule)
      .mock(LabelControlComponent)
      .mock(ReactiveFormsModule),
  );

  it('should create', () => {
    const fixture = MockRender(PaymentsFilterComponent);
    expect(fixture).toBeTruthy();
  });
});
