import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { has } from 'ramda';
import { ModalTermsComponent } from 'src/app/shared/components/modal-terms/modal-terms.component';
import { IEntryModel } from '../../../../shared/models';
import { IDataEnterpriseModel } from '../../../../shared/models/data-enterprise.model';
import { IErrorMessages } from '../../../../shared/models/forms';

@Component({
  selector: 'cs-company-form-auth',
  templateUrl: './company-form-auth.component.html',
  styleUrls: ['./company-form-auth.component.scss'],
})
export class CompanyFormAuthComponent implements OnInit, OnChanges {
  @Output() sendForm = new EventEmitter<IDataEnterpriseModel>();
  @Input() categories: IEntryModel[] = [];
  @Input() companyForm: FormGroup;
  @Input() errorMessages: IErrorMessages;
  @Input() edit = false;

  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    if (has('edit', changes)) {
      this.setForm();
    }
  }

  showModalTerms() {
    this.dialog.open(ModalTermsComponent, {
      width: '810px',
    });
  }

  private setForm() {
    ['password', 'passwordConfirm', 'acceptTerms'].forEach((field) => {
      if (!this.edit) {
        this.companyForm.get(field).enable();
      } else {
        this.companyForm.get(field).disable();
      }
    });
  }

  onSubmit() {
    const {
      passwordConfirm,
      entry: { code },
      ...formValue
    } = this.companyForm.value;
    if (this.companyForm.valid) {
      this.sendForm.emit({ entry: code, ...formValue });
    }
  }
}
