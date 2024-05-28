import {
  type OnChanges,
  type OnDestroy,
  type OnInit,
  type SimpleChanges,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { type DynamicDialogRef } from 'primeng/dynamicdialog';
import { has } from 'ramda';
import { isNotNil, isNotNilOrEmpty } from 'ramda-adjunct';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { ModalTermsComponent } from '../../../../shared/components/modal-terms/modal-terms.component';
import { modalTermsConfig } from '../../../../shared/constants/modal-data';
import { type IEntryModel } from '../../../../shared/models';
import {
  IErrorMessages,
  SimpleModelFormGroup,
} from '../../../../shared/models/forms';
import { DynamicDialogService } from '../../../../shared/services/dynamic-dialog.service';
import { messageErrorNewPasswords } from '../../../../shared/validators/password-validators';
import {
  type AuthForm,
  type CompanyName,
} from '../../services/affiliation-forms.service';

@Component({
  selector: 'cs-company-form-auth',
  templateUrl: './company-form-auth.component.html',
  styleUrls: ['./company-form-auth.component.scss'],
  providers: [DynamicDialogService],
})
export class CompanyFormAuthComponent implements OnInit, OnChanges, OnDestroy {
  $destroy = new Subject();
  ref: DynamicDialogRef;
  @Output() sendForm = new EventEmitter<Partial<AuthForm>>();
  @Input() categories: IEntryModel[] = [];
  @Input() companyForm: SimpleModelFormGroup<AuthForm>;
  @Input() nameOptions: CompanyName[];
  @Input() errorMessages: IErrorMessages;
  @Input() passwordNoEditable = false;
  protected readonly messageErrorNewPasswords = messageErrorNewPasswords;

  constructor(public dialogService: DynamicDialogService) {}

  ngOnInit() {
    this.companyForm
      ?.get('entrySelect')
      .valueChanges.pipe(
        takeUntil(this.$destroy),
        filter((value) => isNotNil(value))
      )
      .subscribe((value: IEntryModel) => {
        this.companyForm.get('entry').setValue(value.code);
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      has('categories', changes) &&
      isNotNilOrEmpty(this.companyForm?.get('entry').value)
    ) {
      this.setCategorySelected();
    }
    if (has('edit', changes)) {
      this.setForm();
    }
  }

  showModalTerms() {
    this.ref = this.dialogService.open(ModalTermsComponent, modalTermsConfig);
  }

  setCategorySelected() {
    const categorySelected = this.categories.find(
      (category) => category.code === this.companyForm.get('entry').value
    );
    this.companyForm.get('entrySelect').setValue(categorySelected);
  }

  private setForm() {
    ['password', 'passwordConfirm', 'acceptTerms'].forEach((field) => {
      if (!this.passwordNoEditable) {
        this.companyForm?.get(field).enable();
      } else {
        this.companyForm?.get(field).disable();
      }
    });
  }

  onSubmit() {
    if (this.companyForm.valid) {
      const name = this.companyForm.get('name').value;
      const { passwordConfirm, ...formValue } = this.companyForm.value;
      let companyData = { name, ...formValue };
      if (!this.passwordNoEditable) {
        const {
          entrySelect: { code },
        } = this.companyForm.value;
        companyData = { ...companyData, entry: code };
      }
      this.sendForm.emit(companyData);
    }
  }
  ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }
    this.$destroy.next(true);
    this.$destroy.complete();
  }
}
