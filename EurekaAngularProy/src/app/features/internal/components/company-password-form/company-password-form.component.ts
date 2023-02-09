import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { IErrorMessages } from '../../../../shared/models/forms';

@Component({
  selector: 'cs-company-password-form',
  templateUrl: './company-password-form.component.html',
  styleUrls: ['./company-password-form.component.scss'],
})
export class CompanyPasswordFormComponent implements OnInit {
  @Input() form: UntypedFormGroup;
  @Input() errorMessages: IErrorMessages;
  @Output() sendForm = new EventEmitter<any>();
  constructor() {}

  ngOnInit() {}
  onSubmit() {
    if (this.form.valid) {
      this.sendForm.emit(this.form.value);
    }
  }
}
