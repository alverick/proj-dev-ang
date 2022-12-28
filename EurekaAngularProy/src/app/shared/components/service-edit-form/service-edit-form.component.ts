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
import { has, isNil } from 'ramda';
import { isNotNil } from 'ramda-adjunct';
import { throttleTime } from 'rxjs/operators';
import {
  debtorCodeCustomEmpty,
  debtorCodeOptions,
} from '../../constants/services';
import { IServiceRemoteModelForms } from '../../models';
import { IErrorMessages } from '../../models/forms';
import { ServicesFormsService } from '../../services';

@Component({
  selector: 'cs-service-edit-form',
  templateUrl: './service-edit-form.component.html',
  styleUrls: ['./service-edit-form.component.scss'],
})
export class ServiceEditFormComponent implements OnInit, OnChanges {
  @Output() sendForm = new EventEmitter<object>();
  @Input() form: FormGroup;
  @Input() errorMessages: IErrorMessages;
  @Input() debtorCodeOptions: any[];
  @Input() paymentTypeOptions: any[];
  @Input() currencyOptions: any[];
  @Input() chargeTypeOptions: any[];
  @Input() interestTypeOptions: any[];
  @Input() reviewMode = true;
  @Input() formData: IServiceRemoteModelForms;
  debtForm: FormGroup;
  debtorCodeEditable = false;
  submittedForm = false;
  formLoaded = false;
  showDebtFields = false;
  constructor(private servicesForms: ServicesFormsService) {}

  ngOnInit() {
    this.listenForChanges();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (has('form', changes) && isNotNil(this.form)) {
      this.debtForm = this.form.get('debt') as FormGroup;
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
      ({ value }) => value === debtorCode
    );
    this.debtorCodeEditable = !isNotDebtorCodeCustom;
    const debtorCodeObj = isNotDebtorCodeCustom
      ? { debtorCode, debtorCodeCustom: debtorCodeCustomEmpty }
      : { debtorCode: 'Otro', debtorCodeCustom: debtorCode };

    const { dataType, chargeType, ...debt } = this.formData.debt;

    setTimeout(() => {
      this.formLoaded = true;
      if (inReview || newNameGTPStatus === 3 || newNameCodeGTPStatus === 3) {
        if (this.reviewMode) {
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
            debtorCodeOriginal
          );
        }
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
        this.reviewMode &&
        (inReview || newNameGTPStatus === 3 || newNameCodeGTPStatus === 3)
      ) {
        this.debtForm.get('chargeType').disable();
        this.debtForm.get('interestType').disable();
        this.debtForm.get('amount').disable();
      }
    }, 400);
  }

  listenForChanges() {
    this.debtForm
      .get('chargeType')
      .statusChanges.pipe(throttleTime(1000))
      .subscribe(() => {
        if (!this.formLoaded) {
          this.setFormData();
        }
      });
    this.form.get('debtorCode').valueChanges.subscribe((val) => {
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
      if (this.reviewMode) {
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
