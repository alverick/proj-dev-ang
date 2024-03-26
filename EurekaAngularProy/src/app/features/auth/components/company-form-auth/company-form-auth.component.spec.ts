import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MockBuilder } from 'ng-mocks';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { PasswordModule } from 'primeng/password';

import { LabelControlComponent } from '../../../../shared/components/label-control/label-control.component';
import { MessageAlertComponent } from '../../../../shared/components/message-alert/message-alert.component';
import { errorRegisterAuth } from '../../../../shared/constants/company-errors';
import type { IEntryModel } from '../../../../shared/models';
import { AffiliationFormsService } from '../../services';
import type { AuthForm } from '../../services/affiliation-forms.service';
import { CompanyFormAuthComponent } from './company-form-auth.component';

describe('CompanyFormAuthComponent', () => {
  let component: CompanyFormAuthComponent;
  let service: AffiliationFormsService;
  let fixture: ComponentFixture<CompanyFormAuthComponent>;
  const dummyData: IEntryModel[] = [
    {
      code: '33',
      name: 'CLUBS CERT II',
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

  beforeEach(() =>
    MockBuilder(CompanyFormAuthComponent)
      .keep(AffiliationFormsService)
      .mock(LabelControlComponent)
      .mock(MessageAlertComponent)
      .mock(DropdownModule)
      .mock(PasswordModule)
      .keep(FormsModule)
      .keep(FormBuilder)
      .keep(ReactiveFormsModule)
      .mock(CheckboxModule)
  );
  beforeEach(() => {
    service = TestBed.inject(AffiliationFormsService);
    fixture = TestBed.createComponent(CompanyFormAuthComponent);
    component = fixture.componentInstance;
    component.companyForm = service.authForm;
    component.errorMessages = errorRegisterAuth;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('setCategorySelected', () => {
    component.categories = dummyData;
    component.companyForm.controls.entry.setValue(dummyData[2].code);
    component.setCategorySelected();

    fixture.detectChanges();

    expect(component.companyForm.value.entrySelect).toEqual(dummyData[2]);
  });

  it('showModalTerms', () => {
    const dialogOpen = component.dialogService.open;
    component.dialogService.open = jest.fn();
    component.showModalTerms();
    expect(component.dialogService.open).toHaveBeenCalled();
    component.dialogService.open = dialogOpen;
  });

  it('validate emit form submit', () => {
    const formData: Partial<AuthForm> = {
      nameSelect: 'tradeName',
      entry: dummyData[2].code,
      entrySelect: dummyData[2],
      password: '38373we@Q',
      acceptTerms: true,
      name: 'Name company',
    };
    component.categories = dummyData;
    component.companyForm.setValue({
      ...formData,
      ruc: '20213094271',
      passwordConfirm: '38373we@Q',
    } as AuthForm);
    component.companyForm.updateValueAndValidity();
    fixture.detectChanges();

    jest.spyOn(component.sendForm, 'emit');
    component.onSubmit();
    expect(component.sendForm.emit).toHaveBeenCalledWith(formData);
  });
});
