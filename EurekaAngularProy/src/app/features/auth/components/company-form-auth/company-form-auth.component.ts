import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { has } from 'ramda';
import { isNotNil, isNotNilOrEmpty } from 'ramda-adjunct';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { ModalTermsComponent } from '../../../../shared/components/modal-terms/modal-terms.component';
import { IEntryModel } from '../../../../shared/models';
import { IDataEnterpriseModel } from '../../../../shared/models/data-enterprise.model';
import { IErrorMessages } from '../../../../shared/models/forms';

@Component({
  selector: 'cs-company-form-auth',
  templateUrl: './company-form-auth.component.html',
  styleUrls: ['./company-form-auth.component.scss'],
  providers: [DialogService],
})
export class CompanyFormAuthComponent implements OnInit, OnChanges, OnDestroy {
  $destroy = new Subject();
  ref: DynamicDialogRef;
  @Output() sendForm = new EventEmitter<IDataEnterpriseModel>();
  @Input() categories: IEntryModel[] = [];
  @Input() companyForm: UntypedFormGroup;
  @Input() errorMessages: IErrorMessages;
  @Input() edit = false;

  constructor(public dialogService: DialogService) {}

  ngOnInit() {
    this.companyForm
      .get('entrySelect')
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
      isNotNilOrEmpty(this.companyForm.get('entry').value)
    ) {
      this.setCategorySelected();
    }
    if (has('edit', changes)) {
      this.setForm();
    }
  }

  showModalTerms() {
    this.ref = this.dialogService.open(ModalTermsComponent, {
      width: '810px',
      header: 'Términos y condiciones',
      styleClass: 'modal-custom-cs',
    });
  }

  setCategorySelected() {
    const categorySelected = this.categories.find(
      (category) => category.code === this.companyForm.get('entry').value
    );
    this.companyForm.get('entrySelect').setValue(categorySelected);
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
  ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }
    this.$destroy.next(true);
    this.$destroy.complete();
  }
}
