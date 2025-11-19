import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { type UntypedFormControl } from '@angular/forms';

import { mobileOperators } from '../../../../shared/constants/company';
import { statusCodes } from '../../../../shared/constants/services';
import { type ICompanyData } from '../../../../shared/models/company-data';
import { EmpresaGTPComponent } from './empresa-gtp.component';

describe('EmpresaGTPComponent', () => {
  let component: EmpresaGTPComponent;
  let fixture: ComponentFixture<EmpresaGTPComponent>;

  const mockEnterprise: ICompanyData = {
    entry: '',
    name: '',
    uniqueCodeIBK: '',
    NombreApproved: true,
    ruc: '12345678901',
    movilOperator: 'CLARO',
    email: 'test@example.com',
    newName: 'New Name',
    movilNumber: '912345678',
    newNameGTPStatus: statusCodes.APPROVED,
    entryName: 'Entry Name',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpresaGTPComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpresaGTPComponent);
    component = fixture.componentInstance;
    component.enterprise = mockEnterprise;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize formGroup with correct values', () => {
    expect(component.formGroup).toBeDefined();
    expect(component.formGroup.get('ruc')?.value).toEqual(mockEnterprise.ruc);
    expect(component.formGroup.get('newName')?.value).toEqual(
      mockEnterprise.newName,
    );
    expect(component.formGroup.get('NewNameApproved')?.value).toEqual('S');
    expect(component.formGroup.get('entry')?.value).toEqual(
      mockEnterprise.entryName,
    );
    expect(component.formGroup.get('email')?.value).toEqual(
      mockEnterprise.email,
    );
    expect(component.formGroup.get('movilNumber')?.value).toEqual(
      mockEnterprise.movilNumber,
    );
    expect(component.formGroup.get('movilOperator')?.value).toEqual(
      mobileOperators.find((op) => op.value === mockEnterprise.movilOperator)
        ?.label,
    );
  });

  it('should disable controls when newNameGTPStatus is APPROVED', () => {
    expect(component.formGroup.get('ruc')?.disabled).toBe(true);
    expect(component.formGroup.get('newName')?.disabled).toBe(true);
    expect(component.formGroup.get('NewNameApproved')?.disabled).toBe(true);
    expect(component.formGroup.get('entry')?.disabled).toBe(true);
    expect(component.formGroup.get('email')?.disabled).toBe(true);
    expect(component.formGroup.get('movilNumber')?.disabled).toBe(true);
    expect(component.formGroup.get('movilOperator')?.disabled).toBe(true);
  });

  it('should enable NewNameApproved when newNameGTPStatus is not APPROVED', () => {
    component.enterprise.newNameGTPStatus = statusCodes.NEW;
    component.ngOnInit();
    expect(component.formGroup.get('NewNameApproved')?.disabled).toBe(false);
  });

  it('should set NewNameApproved to N when NombreApproved is false', () => {
    component.enterprise.NombreApproved = false;
    component.ngOnInit();
    expect(component.formGroup.get('NewNameApproved')?.value).toEqual('N');
  });

  it('should set NewNameApproved to empty string when NombreApproved is undefined', () => {
    component.enterprise.NombreApproved = undefined;
    component.ngOnInit();
    expect(component.formGroup.get('NewNameApproved')?.value).toEqual('');
  });

  it('should get correct error message', () => {
    const emailControl = component.formGroup.get('email') as UntypedFormControl;
    emailControl.setErrors({ required: true });
    const errorMessage = component.getErrorMessage(
      emailControl,
      component.errorMessages.email,
    );
    expect(errorMessage).toEqual(component.errorMessages.email.required);
  });

  it('should return empty string if no error', () => {
    const emailControl = component.formGroup.get('email') as UntypedFormControl;
    emailControl.setErrors(null);
    const errorMessage = component.getErrorMessage(
      emailControl,
      component.errorMessages.email,
    );
    expect(errorMessage).toEqual('');
  });

  it('should emit data on onSubmitEmpresa when form is valid and newNameGTPStatus is NEW', () => {
    component.enterprise.newNameGTPStatus = statusCodes.NEW;
    component.ngOnInit();
    jest.spyOn(component.grabar, 'emit');
    component.formGroup.patchValue({ NewNameApproved: 'N' });
    component.onSubmitEmpresa();
    expect(component.grabar.emit).toHaveBeenCalledWith({
      ...mockEnterprise,
      NombreApproved: false,
      newNameGTPStatus: statusCodes.NEW,
    });
  });

  it('should emit data on onSubmitEmpresa when form is valid and newNameGTPStatus is EDITED', () => {
    component.enterprise.newNameGTPStatus = statusCodes.EDITED;
    component.ngOnInit();
    jest.spyOn(component.grabar, 'emit');
    component.formGroup.patchValue({ NewNameApproved: 'S' });
    component.onSubmitEmpresa();
    expect(component.grabar.emit).toHaveBeenCalledWith({
      ...mockEnterprise,
      NombreApproved: true,
      newNameGTPStatus: statusCodes.EDITED,
    });
  });

  it('should emit data on onSubmitEmpresa when form is valid and newNameGTPStatus is APPROVED', () => {
    component.enterprise.newNameGTPStatus = statusCodes.APPROVED;
    component.ngOnInit();
    jest.spyOn(component.grabar, 'emit');
    component.onSubmitEmpresa();
    expect(component.grabar.emit).not.toHaveBeenCalled();
  });

  it('should not emit data on onSubmitEmpresa when form is invalid', () => {
    jest.spyOn(component.grabar, 'emit');
    component.formGroup.get('email')?.setErrors({ required: true });
    component.onSubmitEmpresa();
    expect(component.grabar.emit).not.toHaveBeenCalled();
  });

  it('should set submitted to true on onSubmitEmpresa', () => {
    component.onSubmitEmpresa();
    expect(component.submitted).toBe(true);
  });
});
