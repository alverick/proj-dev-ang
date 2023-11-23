import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  applicationConfig,
  Meta,
  moduleMetadata,
  StoryObj,
} from '@storybook/angular';
import { isNotNilOrEmpty } from 'ramda-adjunct';

import { errorRegisterAuth } from '../../../../shared/constants/company-errors';
import { IEntryModel } from '../../../../shared/models';
import { IErrorMessages } from '../../../../shared/models/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { AffiliationFormsService } from '../../services';
import { AuthForm } from '../../services/affiliation-forms.service';
import { CompanyFormAuthComponent } from './company-form-auth.component';

@Component({
  selector: 'cs-form-demo',
  template: ` <cs-company-form-auth
    class="tw-max-w-2xl tw-pl-20"
    [categories]="entryOptions"
    [companyForm]="form"
    [errorMessages]="errorMessages"
    (sendForm)="onSubmit($event)"
  ></cs-company-form-auth>`,
})
class FormDemoComponent implements OnChanges {
  @Output() sendForm = new EventEmitter<AuthForm>();
  form: FormGroup;
  @Input() errorMessages: IErrorMessages;
  @Input() companyName = '';
  entryOptions: IEntryModel[] = [
    {
      code: '33',
      name: 'CLUBS II',
    },
    {
      code: '34',
      name: 'COLEGIOS II',
    },
    {
      code: '36',
      name: 'ESTADO II',
    },
    {
      code: '39',
      name: 'IB OPER.INTII',
    },
    {
      code: '40',
      name: 'INMOBILIAR II',
    },
    {
      code: '38',
      name: 'PREPA/RECARII',
    },
    {
      code: '32',
      name: 'SEGURO/OTROII',
    },
    {
      code: '31',
      name: 'SERVICIOS II',
    },
    {
      code: '35',
      name: 'UNIV/INST II',
    },
    {
      code: '37',
      name: 'VARIOS II',
    },
  ];

  constructor(affiliationForms: AffiliationFormsService) {
    this.form = affiliationForms.authForm;
    this.form.patchValue(
      {
        name: this.companyName,
        // documentType: 'DNI',
        // documentNumber: '93883333',
        ruc: '20413425183',
        // email: 'sdfs@fsf.com',
        // emailConfirm: 'sdfs@fsf.com',
        // movilNumber: '982222222',
        // movilOperator: 'M',
      },
      { emitEvent: false }
    );
    if (isNotNilOrEmpty(this.companyName)) {
      this.form.get('name').disable({ emitEvent: false });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.companyName) {
      this.form.patchValue(
        {
          name: this.companyName,
        },
        { emitEvent: false }
      );
      if (isNotNilOrEmpty(this.companyName)) {
        this.form.get('name').disable({ emitEvent: false });
      }
    }
  }

  onSubmit($event: AuthForm) {
    this.sendForm.emit($event);
  }
}

const meta: Meta<FormDemoComponent> = {
  title: 'Auth/Module/Company Form Auth',
  component: FormDemoComponent,
  decorators: [
    applicationConfig({ providers: [provideAnimations()] }),
    moduleMetadata({
      declarations: [FormDemoComponent, CompanyFormAuthComponent],
      imports: [SharedModule],
      providers: [AffiliationFormsService],
    }),
  ],
};

export default meta;

type Story = StoryObj<FormDemoComponent>;

export const normal: Story = {
  args: {
    errorMessages: errorRegisterAuth,
  },
};

export const Named: Story = {
  args: {
    errorMessages: errorRegisterAuth,
    companyName: 'Nombre de compañia',
  },
};
