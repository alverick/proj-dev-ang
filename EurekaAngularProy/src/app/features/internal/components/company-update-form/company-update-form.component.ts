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
import { FormGroup, NgForm } from '@angular/forms';
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
  blockSpecial: RegExp = /^[a-z0-9]+$/i;
  @Input() operators = [];
  @Input() documentTypes = [];
  @Input() categories: IEntryModel[] = [];
  @Input() errorMessages: IErrorMessages;
  @Input() form: FormGroup;
  @Input() submitted = false;
  @Input() inReview = false;
  @Output() showPanel = new EventEmitter<any>();
  @ViewChild('formElm', { static: false })
  htmlForm: NgForm;
  showDocumentFields = false;

  constructor() {}

  ngOnInit() {
    this.form.valueChanges.subscribe(() => {
      const { documentType, documentNumber } = this.form.getRawValue();
      this.showDocumentFields = !(isNil(documentType) && isNil(documentNumber));
    });
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
