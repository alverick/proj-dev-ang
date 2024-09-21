import {
  type OnChanges,
  type OnInit,
  type SimpleChanges,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { isNil, pathEq } from 'ramda';

import {
  type SimpleModelFormGroup,
  IErrorMessages,
} from '../../../../shared/models/forms';
import { type CompanyForm } from '../../services/company-configuration.service';

@Component({
  selector: 'cs-company-update-form',
  templateUrl: './company-update-form.component.html',
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
