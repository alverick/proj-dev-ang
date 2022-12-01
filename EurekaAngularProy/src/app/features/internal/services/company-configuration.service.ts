import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { isNotEmpty } from 'ramda-adjunct';
import { tap } from 'rxjs/operators';
import { CompanyService } from 'src/app/shared/services/company.service';
import { IEntryModel } from '../../../shared/models';
import { IDataEnterpriseModel } from '../../../shared/models/data-enterprise.model';
import { EnterpriseHeadingService } from '../../../shared/services/enterprise-heading.service';
import { swalAlert } from '../../../shared/utils/helpers/popups';
import { MustMatch } from '../../../shared/validators/must-match.validator';
import { internalFullRoutingNames } from '../internal-routing.names';

@Injectable({
  providedIn: 'root',
})
export class CompanyConfigurationService {
  companyData: IDataEnterpriseModel;
  companyForm: FormGroup;
  passwordForm: FormGroup;
  entryOptions: IEntryModel[] = [];
  constructor(
    private fb: FormBuilder,
    private companyService: CompanyService,
    private enterpriseHeading: EnterpriseHeadingService,
    private router: Router
  ) {
    this.initForms();
    this.getEntryOptions();
    this.getCompanyData();
  }

  getCompanyData() {
    this.companyService.getCompanyData().subscribe((data) => {
      console.log(data);
      this.companyData = data;
      this.companyForm.patchValue(data);
      if (data.inReview) {
        this.companyForm.get('name').disable();
      }
      this.setCategory();
    });
  }

  saveCompanyData() {
    const { email, movilNumber, movilOperator, name } = this.companyForm.value;
    const companyDataUpdated = {
      newName: name,
      email,
      movilNumber,
      movilOperator,
    };
    const enterprise = {
      ruc: this.companyData.ruc,
      password: '',
      newPassword: '',
      confirmNewPassword: '',
      ...companyDataUpdated,
    };
    this.companyService
      .updateCompany(enterprise)
      .subscribe((enterpriseUpdate) => {
        if (enterpriseUpdate.success === true) {
          swalAlert
            .fire({
              text: 'Los datos de la empresa han sido actualizados',
              showCloseButton: true,
              confirmButtonText: 'ACEPTAR',
            })
            .then((result) => {
              if (result.value) {
                this.router.navigate([internalFullRoutingNames.HOME]);
              }
            });
        }
        if (enterpriseUpdate.success === false) {
          // this.mensaje(
          //   'warning',
          //   'Edicion de Empresa',
          //   'La contraseña no coincide con la contraseña actual'
          // );
          swalAlert.fire({
            title: 'Datos de Empresa guardados',
            text: 'Sus datos han sido actualizados',
            showCloseButton: true,
            confirmButtonText: 'ACEPTAR',
            onAfterClose: () => {
              // datosEmpresa.email = datosEmpresa.newEmail;
              // datosEmpresa.movilNumber = datosEmpresa.newMovilNumber;
              // datosEmpresa.password = datosEmpresa.newPassword;
            },
          });
          return;
        }
      });
  }

  savePassword() {
    const { password, newPassword, confirmNewPassword } =
      this.passwordForm.value;
    const { email, movilNumber, movilOperator, name } = this.companyData;
    const companyDataUpdated = {
      newName: name,
      email,
      movilNumber,
      movilOperator,
    };
    const enterprise = {
      ruc: this.companyData.ruc,
      password,
      newPassword,
      confirmNewPassword,
      ...companyDataUpdated,
    };
    return this.companyService.updateCompany(enterprise).pipe(
      tap((enterpriseUpdate) => {
        if (enterpriseUpdate.success === true) {
          swalAlert.fire({
            text: 'Los datos de la empresa han sido actualizados',
            showCloseButton: true,
            confirmButtonText: 'ACEPTAR',
          });
        }
        if (enterpriseUpdate.success === false) {
          swalAlert.fire({
            icon: 'warning',
            text: 'La contraseña no coincide con la contraseña actual',
            showCloseButton: true,
            confirmButtonText: 'ACEPTAR',
          });
        }
      })
    );
  }

  public getEntryOptions(): void {
    console.log('-> getEntryOptions');

    this.enterpriseHeading.getEntryOptions().subscribe((result) => {
      this.entryOptions = result;
      this.setCategory();
    });
  }

  setCategory() {
    const entryControl = this.companyForm.get('entry');
    if (isNotEmpty(this.entryOptions) && isNotEmpty(entryControl.value)) {
      const entrySel = this.entryOptions.find(
        (entry) => entry.code === entryControl.value
      );
      this.companyForm.get('entrySelect').setValue(entrySel);
    }
  }

  private initForms() {
    this.companyForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(80),
        ],
      ],
      ruc: [{ value: '', disabled: true }],
      entry: [{ value: '', disabled: true }],
      entrySelect: [{ value: '', disabled: true }],
      documentType: [{ value: '', disabled: true }],
      documentNumber: [{ value: '', disabled: true }],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          ),
          Validators.minLength(10),
          Validators.maxLength(100),
        ],
      ],
      movilOperator: ['', [Validators.required]],
      movilNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^9\d{8}$/),
          Validators.minLength(9),
          Validators.maxLength(9),
        ],
      ],
    });
    this.passwordForm = this.fb.group(
      {
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
          ],
        ],
        newPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
          ],
        ],
        confirmNewPassword: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
          ],
        ],
      },
      {
        validator: MustMatch('newPassword', 'confirmNewPassword'),
      }
    );
  }
}
