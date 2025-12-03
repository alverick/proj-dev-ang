import {
  Component,
  inject,
  input,
  type OnChanges,
  type OnDestroy,
  type OnInit,
  output,
  type SimpleChanges,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PrimeTemplate } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { type DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { KeyFilterModule } from 'primeng/keyfilter';
import { PasswordModule } from 'primeng/password';
import { Ripple } from 'primeng/ripple';
import { Select } from 'primeng/select';
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
    PrimeTemplate,
    MessageAlertComponent,
    PasswordModule,
    ControlRulesPoliciesComponent,
    CheckboxModule,
    ButtonDirective,
    Ripple,
    Select,
  ],
})
export class CompanyFormAuthComponent implements OnInit, OnChanges, OnDestroy {
  dialogService = inject(DynamicDialogService);

  $destroy = new Subject();
  ref: DynamicDialogRef;
  readonly sendForm = output<Partial<AuthForm>>();
  readonly categories = input<IEntryModel[]>([]);
  readonly companyForm = input<SimpleModelFormGroup<AuthForm>>(undefined);
  readonly nameOptions = input<CompanyName[]>(undefined);
  readonly errorMessages = input<IErrorMessages>(undefined);
  readonly passwordNoEditable = input(false);
  protected readonly messageErrorNewPasswords = messageErrorNewPasswords;
  namePattern = namePattern;

  ngOnInit() {
    this.companyForm()
      ?.get('entrySelect')
      .valueChanges.pipe(
        takeUntil(this.$destroy),
        filter((value) => isNotNil(value)),
      )
      .subscribe((value: IEntryModel) => {
        this.companyForm().get('entry').setValue(value.code);
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      has('categories', changes) &&
      isNotNilOrEmpty(this.companyForm()?.get('entry').value)
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
    const categorySelected = this.categories().find(
      (category) => category.code === this.companyForm().get('entry').value,
    );
    this.companyForm().get('entrySelect').setValue(categorySelected);
  }

  private setForm() {
    ['password', 'passwordConfirm', 'acceptTerms'].forEach((field) => {
      if (this.passwordNoEditable()) {
        this.companyForm()?.get(field).disable();
      } else {
        this.companyForm()?.get(field).enable();
      }
    });
  }

  onSubmit() {
    const companyForm = this.companyForm();
    if (companyForm.valid) {
      const name = companyForm.get('name').value;
      const { passwordConfirm, ...formValue } = companyForm.value;
      let companyData = { name, ...formValue };
      if (!this.passwordNoEditable()) {
        const {
          entrySelect: { code },
        } = companyForm.value;
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
