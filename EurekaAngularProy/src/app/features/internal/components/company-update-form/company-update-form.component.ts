import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { NgForm, UntypedFormGroup } from '@angular/forms';
import { isNil, pathEq } from 'ramda';
import { IErrorMessages } from 'src/app/shared/models/forms';

import { IEntryModel } from '../../../../shared/models';

@Component({
  selector: 'cs-company-update-form',
  templateUrl: './company-update-form.component.html',
  styleUrls: ['./company-update-form.component.scss'],
})
export class CompanyUpdateFormComponent implements OnInit, OnChanges {
  documentNumberMax = '8';
  documentNumberFilter: string | RegExp = 'int';
  @Input() operators = [];
  @Input() documentTypes = [];
  @Input() errorMessages: IErrorMessages;
  @Input() form: UntypedFormGroup;
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
    if (pathEq(['submitted', 'currentValue'], true, changes) && this.htmlForm) {
      this.htmlForm.onSubmit(null);
    }
  }

  openPanel() {
    this.showPanel.emit();
  }
}
