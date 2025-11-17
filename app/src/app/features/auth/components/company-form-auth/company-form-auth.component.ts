import {
  Component,
  EventEmitter,
  Input,
  type OnChanges,
  type OnDestroy,
  type OnInit,
  Output,
  type SimpleChanges,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeTemplate } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { type DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { PasswordModule } from 'primeng/password';
import { Ripple } from 'primeng/ripple';
import { has } from 'ramda';
import { isNotNil, isNotNilOrEmpty } from 'ramda-adjunct';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { ControlRulesPoliciesComponent } from '../../../../shared/components/control-rules-policies/control-rules-policies.component';
import { LabelControlComponent } from '../../../../shared/components/label-control/label-control.component';
import { MessageAlertComponent } from '../../../../shared/components/message-alert/message-alert.component';
import { ModalTermsComponent } from '../../../../shared/components/modal-terms/modal-terms.component';
import { modalTermsConfig } from '../../../../shared/constants/modal-data';
import { InputWithoutSpacesDirective } from '../../../../shared/directives/input-without-spaces.directive';
import { type IEntryModel } from '../../../../shared/models';
import {
  IErrorMessages,
  SimpleModelFormGroup,
} from '../../../../shared/models/forms';
import { DynamicDialogService } from '../../../../shared/services/dynamic-dialog.service';
import { namePattern } from '../../../../shared/validators/company-validators';
import { messageErrorNewPasswords } from '../../../../shared/validators/password-validators';
import {
  type AuthForm,
  type CompanyName,
} from '../../services/affiliation-forms.service';

@Component({
  selector: 'cs-company-form-auth',
  templateUrl: './company-form-auth.component.html',
  providers: [DynamicDialogService],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    LabelControlComponent,
    InputTextModule,
    KeyFilterModule,
    InputWithoutSpacesDirective,
    DropdownModule,
    PrimeTemplate,
    MessageAlertComponent,
    PasswordModule,
    ControlRulesPoliciesComponent,
    CheckboxModule,
    ButtonDirective,
    Ripple,
  ],
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
  namePattern = namePattern;

  constructor(public dialogService: DynamicDialogService) {}

  ngOnInit() {
    this.companyForm
      ?.get('entrySelect')
      .valueChanges.pipe(
        takeUntil(this.$destroy),
        filter((value) => isNotNil(value)),
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
    if (has('passwordNoEditable', changes)) {
      this.setForm();
    }
  }

  showModalTerms() {
    this.ref = this.dialogService.open(ModalTermsComponent, modalTermsConfig);
  }

  setCategorySelected() {
    const categorySelected = this.categories.find(
      (category) => category.code === this.companyForm.get('entry').value,
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
