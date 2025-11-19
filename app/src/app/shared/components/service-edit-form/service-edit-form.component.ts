import {
  Component,
  EventEmitter,
  Input,
  type OnChanges,
  type OnInit,
  Output,
  type SimpleChanges,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  type UntypedFormGroup,
} from '@angular/forms';
import { ButtonDirective } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { Ripple } from 'primeng/ripple';
import { Select } from 'primeng/select';
import { has, isNil } from 'ramda';
import { isNotNil } from 'ramda-adjunct';
import { throttleTime } from 'rxjs/operators';

import {
  debtorCodeCustomEmpty,
  debtorCodeOptions,
} from '../../constants/services';
import { InputWithoutSpacesDirective } from '../../directives/input-without-spaces.directive';
import { IServiceRemoteModelForms } from '../../models';
import { IErrorMessages } from '../../models/forms';
import { ServicesFormsService } from '../../services';
import { namePattern } from '../../validators/service-validators';
import { LabelControlComponent } from '../label-control/label-control.component';
import { ServiceChannelChipComponent } from '../service-channel-chip/service-channel-chip.component';
import { ServiceDebtFormComponent } from '../service-debt-form/service-debt-form.component';

@Component({
  selector: 'cs-service-edit-form',
  templateUrl: './service-edit-form.component.html',
  styleUrls: ['./service-edit-form.component.scss'],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    LabelControlComponent,
    InputTextModule,
    MessageModule,
    InputWithoutSpacesDirective,
    ButtonDirective,
    ServiceDebtFormComponent,
    CheckboxModule,
    ServiceChannelChipComponent,
    Ripple,
    Select,
  ],
})
export class ServiceEditFormComponent implements OnInit, OnChanges {
  @Output() sendForm = new EventEmitter<object>();
  @Input() form: UntypedFormGroup;
  @Input() errorMessages: IErrorMessages;
  @Input() debtorCodeOptions: any[];
  @Input() paymentTypeOptions: any[];
  @Input() currencyOptions: any[];
  @Input() chargeTypeOptions: any[];
  @Input() interestTypeOptions: any[];
  @Input() affiliationMode = true;
  @Input() interestOnlyInfo = false;
  @Input() formData: IServiceRemoteModelForms;
  debtForm: UntypedFormGroup;
  debtorCodeEditable = false;
  submittedForm = false;
  formLoaded = false;
  showDebtFields = false;
  protected readonly namePattern = namePattern;
  constructor(private readonly servicesForms: ServicesFormsService) {}

  ngOnInit() {
    this.listenForChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (has('form', changes) && isNotNil(this.form)) {
      this.debtForm = this.form.get('debt') as UntypedFormGroup;
    }
    if (has('formData', changes) && isNotNil(this.formData)) {
      const { dataType, ...debt } = this.formData.debt;
      this.formLoaded = false;
      this.setDebtForm(dataType, debt.chargeInterest);
    }
  }

  showDropdown() {
    this.form.get('debtorCode').setValue('');
    this.debtorCodeEditable = false;
  }

  setFormData() {
    if (isNil(this.formData)) {
      return;
    }
    const {
      inReview,
      debtorCode,
      newNameGTPStatus,
      newNameCode,
      newNameCodeGTPStatus,
      debtorCodeOriginal,
      ...formData
    } = this.formData;
    const isNotDebtorCodeCustom = debtorCodeOptions.some(
      ({ value }) => value === debtorCode,
    );
    this.debtorCodeEditable = !isNotDebtorCodeCustom;
    const debtorCodeObj = isNotDebtorCodeCustom
      ? { debtorCode, debtorCodeCustom: debtorCodeCustomEmpty }
      : { debtorCode: 'Otro', debtorCodeCustom: debtorCode };

    const { dataType, chargeType, ...debt } = this.formData.debt;

    setTimeout(() => {
      this.formLoaded = true;
      if (inReview || newNameGTPStatus === 3 || newNameCodeGTPStatus === 3) {
        if (this.affiliationMode) {
          this.form.get('debt').disable();
          this.form.get('useAgent').disable();
          this.debtForm.get('chargeType').disable();
          this.debtForm.get('interestType').disable();
          this.debtForm.get('amount').disable();
          if (newNameGTPStatus === 3) {
            this.form.get('name').enable();
          } else {
            this.form.get('name').disable();
          }
          if (newNameCodeGTPStatus === 3) {
            this.form.get('debtorCode').enable();
            this.form.get('debtorCodeCustom').enable();
          } else {
            this.form.get('debtorCode').disable();
            this.form.get('debtorCodeCustom').disable();
          }
        }
        if (newNameCodeGTPStatus === 3) {
          this.servicesForms.setServiceEditDebtorCodeValidate(
            this.debtorCodeEditable,
            debtorCodeOriginal,
          );
        }
      } else {
        this.servicesForms.setServiceEditDebtorCodeValidate(
          this.debtorCodeEditable,
        );
      }
      this.form.patchValue({
        ...formData,
        debtorCode,
        ...debtorCodeObj,
        debt: { ...debt, chargeType: String(chargeType) },
      });
    }, 300);
    setTimeout(() => {
      if (
        this.affiliationMode &&
        (inReview || newNameGTPStatus === 3 || newNameCodeGTPStatus === 3)
      ) {
        this.debtForm.get('chargeType').disable({ emitEvent: false });
        this.debtForm.get('amount').disable({ emitEvent: false });
        this.debtForm.get('interestType').disable({ emitEvent: false });
      }
    }, 400);
  }

  listenForChanges() {
    this.debtForm
      ?.get('chargeType')
      .statusChanges.pipe(throttleTime(1000))
      .subscribe(() => {
        if (!this.formLoaded) {
          this.setFormData();
        }
      });
    this.form?.get('debtorCode').valueChanges.subscribe((val) => {
      this.debtorCodeEditable = val === 'Otro';
      if (val === 'Otro') {
        this.form.get('debtorCodeCustom').setValue('');
      } else {
        this.form.get('debtorCodeCustom').setValue(debtorCodeCustomEmpty);
      }
    });
  }

  private setDebtForm(dataType, chargeInterest) {
    this.showDebtFields = dataType === 'C';
    if ('C' === dataType) {
      this.debtForm.enable();
      this.debtForm.get('chargeInterest').setValue(chargeInterest);
    } else {
      this.setFormData();
      if (this.affiliationMode) {
        this.debtForm.disable();
      }
    }
  }

  onSubmit() {
    const { emailConfirm, ...formValue } = this.form.value;
    this.submittedForm = true;
    if (this.form.valid) {
      this.sendForm.emit({ ...formValue });
    }
  }
}
