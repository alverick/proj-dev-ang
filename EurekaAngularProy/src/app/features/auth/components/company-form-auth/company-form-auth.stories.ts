import {
  type OnChanges,
  type SimpleChanges,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { type FormGroup } from '@angular/forms';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  type Meta,
  type StoryObj,
  applicationConfig,
  moduleMetadata,
} from '@storybook/angular';

import { errorRegisterAuth } from '../../../../shared/constants/company-errors';
import { type IEntryModel } from '../../../../shared/models';
import { IErrorMessages } from '../../../../shared/models/forms';
import { SharedModule } from '../../../../shared/shared.module';
import { AffiliationFormsService } from '../../services';
import {
  type AuthForm,
  type CompanyName,
} from '../../services/affiliation-forms.service';
import { CompanyFormAuthComponent } from './company-form-auth.component';

@Component({
  selector: 'cs-form-demo',
  template: ` <cs-company-form-auth
    class="tw-max-w-2xl tw-pl-20"
    [passwordNoEditable]="edit"
    [categories]="entryOptions"
    [companyForm]="form"
    [errorMessages]="errorMessages"
    [nameOptions]="companyName"
    (sendForm)="onSubmit($event)"
  ></cs-company-form-auth>`,
})
class FormDemoComponent implements OnChanges {
  @Output() sendForm = new EventEmitter<AuthForm>();
  form: FormGroup;
  @Input() errorMessages: IErrorMessages;
  @Input() companyName: CompanyName[];
  @Input() edit = false;
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
        ruc: '20413425183',
        acceptTerms: true,
        entry: '39',
        nameSelect: {
          description: 'Razón social',
          label: 'Nombre de compañia',
          value: 'fullName',
        },
        password: 'aas@3W233',
        passwordConfirm: 'aas@3W233',
      },
      { emitEvent: false }
    );
    console.log(this.companyName);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.companyName) {
      const defaultValue =
        this.companyName.find((item) => item.value === 'tradeName') ||
        this.companyName[0];

      this.form.patchValue({
        name: defaultValue.label,
      });
      this.form.get('nameSelect').setValue(defaultValue);
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

export const Simple: Story = {
  args: {
    ...normal.args,
    companyName: [
      {
        label:
          'Nombre de compañia tradeName Nombre de compañia tradeName Nombre de compañia tradeName fin',
        value: 'fullName',
        description: 'Razón social',
      },
    ],
  },
};

export const Full: Story = {
  args: {
    ...normal.args,
    companyName: [
      {
        label:
          'Nombre de compañia tradeName Nombre de compañia tradeName Nombre de compañia tradeName',
        value: 'tradeName',
        description: 'Nombre comercial',
      },
      {
        label: 'Nombre de compañia fullName',
        value: 'fullName',
        description: 'Razón social',
      },
    ],
  },
};

export const Rejected: Story = {
  args: {
    ...normal.args,
    edit: true,
  },
};
