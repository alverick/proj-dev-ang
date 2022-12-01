import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IErrorMessages } from '../../../../shared/models/forms';

@Component({
  selector: 'cs-company-password-form',
  templateUrl: './company-password-form.component.html',
  styleUrls: ['./company-password-form.component.scss'],
})
export class CompanyPasswordFormComponent implements OnInit {
  @Input() form: FormGroup;
  @Input() errorMessages: IErrorMessages;
  @Output() sendForm = new EventEmitter<any>();
  constructor() {}

  ngOnInit() {}
  onSubmit() {
    console.log(this);
    if (this.form.valid) {
      this.sendForm.emit(this.form.value);
    }
  }
}
