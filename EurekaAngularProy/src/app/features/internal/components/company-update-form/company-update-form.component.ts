import { KeyValuePipe } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  type OnChanges,
  type OnInit,
  Output,
  type SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import {
  ValidationErrorDirective,
  ValidationErrorsComponent,
} from 'ngx-valdemort';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { isNil, pathEq } from 'ramda';

import { LabelControlComponent } from '../../../../shared/components/label-control/label-control.component';
import { InputTrimSpacesDirective } from '../../../../shared/directives/input-trim-spaces.directive';
import { InputWithoutSpacesDirective } from '../../../../shared/directives/input-without-spaces.directive';
import { CompanyForm } from '../../../../shared/models/company-forms';
import {
  IErrorMessages,
  type SimpleModelFormGroup,
} from '../../../../shared/models/forms';

@Component({
  selector: 'cs-company-update-form',
  templateUrl: './company-update-form.component.html',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    LabelControlComponent,
    InputTextModule,
    InputWithoutSpacesDirective,
    KeyFilterModule,
    DropdownModule,
    ValidationErrorsComponent,
    ValidationErrorDirective,
    InputTrimSpacesDirective,
    KeyValuePipe,
  ],
})
export class CompanyUpdateFormComponent implements OnInit, OnChanges {
  documentNumberMax = '8';
  documentNumberFilter: string | RegExp = 'int';
  @Input() operators = [];
  @Input() documentTypes = [];
  @Input() errorMessages: IErrorMessages;
  @Input() form: SimpleModelFormGroup<CompanyForm>;
  @Input() submitted = false;
  @Input() inReview = false;
  @Input() nameInReview = '';
  @Output() showPanel = new EventEmitter<any>();
  @ViewChild('formElm') htmlForm: NgForm;
  showDocumentFields = false;

  ngOnInit() {
    const { documentType, documentNumber } = this.form.getRawValue();
    this.showDocumentFields = !(isNil(documentType) && isNil(documentNumber));
  }

  ngOnChanges(changes: SimpleChanges) {
    if (pathEq(true, ['submitted', 'currentValue'], changes) && this.htmlForm) {
      this.htmlForm.onSubmit(null);
    }
  }

  openPanel() {
    this.showPanel.emit();
  }
}
