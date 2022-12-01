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
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
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
  @Output() showPanel = new EventEmitter<any>();
  @ViewChild('formElm', { static: false })
  htmlForm: NgForm;
  showDocumentFields = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form.valueChanges.subscribe((value) => {
      this.showDocumentFields = !(
        isNil(value.documentType) && isNil(value.documentNumber)
      );
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
