import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ModalTermsComponent } from 'src/app/shared/components/modal-terms/modal-terms.component';
import { IEntryModel } from '../../../../shared/models';
import { IDataEnterpriseModel } from '../../../../shared/models/data-enterprise.model';
import { IErrorMessages } from '../../../../shared/models/forms';

@Component({
  selector: 'cs-company-form-auth',
  templateUrl: './company-form-auth.component.html',
  styleUrls: ['./company-form-auth.component.scss'],
})
export class CompanyFormAuthComponent implements OnInit {
  @Output() sendForm = new EventEmitter<IDataEnterpriseModel>();
  @Input() categories: IEntryModel[] = [];
  @Input() companyForm: FormGroup;
  @Input() errorMessages: IErrorMessages;

  constructor(public dialog: MatDialog) {}

  ngOnInit() {}

  showModalTerms() {
    this.dialog.open(ModalTermsComponent, {
      width: '810px',
    });
  }

  nameInput() {
    let initalValue = this.companyForm.get('name').value;
    initalValue = initalValue.replace(/\s{2,}/g, ' ');
    this.companyForm
      .get('name')
      .setValue(initalValue.replace(/[^ 0-9-A-Z-a-z]*/g, ''));
  }

  nameBlur() {
    const initalValue = this.companyForm.get('name').value;
    this.companyForm.get('name').setValue(initalValue.trim());
  }

  onSubmit() {
    const { passwordConfirm, ...formValue } = this.companyForm.value;
    console.log('-> formValue', formValue);
    if (this.companyForm.valid) {
      this.sendForm.emit({ ...formValue });
    }
  }
}
