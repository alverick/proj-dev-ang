import { KeyValuePipe } from '@angular/common';
import {
  Component,
  input,
  type OnChanges,
  type OnInit,
  output,
  type SimpleChanges,
  viewChild,
} from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import {
  ValidationErrorDirective,
  ValidationErrorsComponent,
} from 'ngx-valdemort';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { Select } from 'primeng/select';
import { isNil, pathEq } from 'ramda';

import { LabelControlComponent } from '../../../../shared/components/label-control/label-control.component';
import { InputTrimSpacesDirective } from '../../../../shared/directives/input-trim-spaces.directive';
import { InputWithoutSpacesDirective } from '../../../../shared/directives/input-without-spaces.directive';
import { CompanyForm } from '../../../../shared/models/company-forms';
import {
  IErrorMessages,
  type SimpleModelFormGroup,
} from '../../../../shared/models/forms';
import { namePattern } from '../../../../shared/validators/company-validators';

@Component({
  selector: 'cs-company-update-form',
  templateUrl: './company-update-form.component.html',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    LabelControlComponent,
    InputTextModule,
    InputWithoutSpacesDirective,
    KeyFilterModule,
    ValidationErrorsComponent,
    ValidationErrorDirective,
    InputTrimSpacesDirective,
    KeyValuePipe,
    Select,
  ],
})
export class CompanyUpdateFormComponent implements OnInit, OnChanges {
  documentNumberMax = '8';
  documentNumberFilter: string | RegExp = 'int';
  readonly operators = input([]);
  readonly documentTypes = input([]);
  readonly errorMessages = input<IErrorMessages>(undefined);
  readonly form = input<SimpleModelFormGroup<CompanyForm>>(undefined);
  readonly submitted = input(false);
  readonly inReview = input(false);
  readonly nameInReview = input('');
  readonly showPanel = output<any>();
  readonly htmlForm = viewChild<NgForm>('formElm');
  showDocumentFields = false;
  protected readonly namePattern = namePattern;

  ngOnInit() {
    const { documentType, documentNumber } = this.form().getRawValue();
    this.showDocumentFields = !(isNil(documentType) && isNil(documentNumber));
  }

  ngOnChanges(changes: SimpleChanges) {
    const htmlForm = this.htmlForm();
    if (pathEq(true, ['submitted', 'currentValue'], changes) && htmlForm) {
      htmlForm.onSubmit(null);
    }
  }

  openPanel() {
    this.showPanel.emit(true);
  }
}
