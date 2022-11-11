import {
  APP_INITIALIZER,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { action } from '@storybook/addon-actions';
import { withKnobs } from '@storybook/addon-knobs';
import { moduleMetadata } from '@storybook/angular';
import { IDataEnterpriseModel } from '../../../../shared/models/data-enterprise.model';
import { SharedModule } from '../../../../shared/shared.module';
import {
  documentTypes,
  errorsRegisterForm,
  mobileOperators,
} from '../../constants';
import { AffiliationFormsService } from '../../services';
import { CompanyFormRegistrationComponent } from './company-form-registration.component';

@Component({
  selector: 'cs-form-demo',
  template: `<cs-company-form-registration
    class="tw-max-w-2xl tw-pl-20"
    [registerForm]="registerForm"
    [errorMessages]="errors"
    [operators]="operators"
    [documentTypes]="documentTypes"
    (sendForm)="onSubmit($event)"
  ></cs-company-form-registration>`,
})
class FormDemoComponent {
  @Output() sendForm = new EventEmitter<IDataEnterpriseModel>();
  registerForm: FormGroup;
  errors = errorsRegisterForm;
  operators = mobileOperators;
  documentTypes = documentTypes;
  constructor(affiliationForms: AffiliationFormsService) {
    this.registerForm = affiliationForms.registerForm;
    this.registerForm.setValue({
      documentType: 'DNI',
      documentNumber: '93883333',
      ruc: '20413425183',
      email: 'sdfs@fsf.com',
      emailConfirm: 'sdfs@fsf.com',
      movilNumber: '982222222',
      movilOperator: 'M',
    });
  }
  onSubmit($event) {
    this.sendForm.emit($event);
  }
}

const initAppComponentFactory =
  (affiliationForms: AffiliationFormsService) => async () =>
    affiliationForms;

export default {
  title: 'Auth/Module/Company Form Registration',
  component: CompanyFormRegistrationComponent,
  decorators: [
    withKnobs,
    moduleMetadata({
      imports: [BrowserAnimationsModule, SharedModule],
      providers: [
        AffiliationFormsService,
        {
          provide: APP_INITIALIZER,
          useFactory: initAppComponentFactory,
          multi: true,
          deps: [AffiliationFormsService],
        },
      ],
    }),
  ],
};

export const normal = () => {
  return {
    component: CompanyFormRegistrationComponent,
    moduleMetadata: {
      declarations: [FormDemoComponent, CompanyFormRegistrationComponent],
      providers: [],
    },
    template: `<cs-validation-defaults></cs-validation-defaults>
<cs-form-demo (sendForm)="onSubmit($event)"></cs-form-demo>`,
    props: {
      onSubmit: (e) => {
        console.log(e);
        action('form data')(e);
      },
    },
  };
};
