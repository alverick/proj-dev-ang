import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MockBuilder, MockRender } from 'ng-mocks';
import { PasswordModule } from 'primeng/password';
import { Subject } from 'rxjs';

import { LabelControlComponent } from '../../../../shared/components/label-control/label-control.component';
import { RecuperaService } from '../../../../shared/services/recupera.service';
import { StorageService } from '../../../../shared/services/storage.service';
import { swalAlert } from '../../../../shared/utils/helpers/popups';
import { LayoutFormComponent } from '../../components/layout-form/layout-form.component';
import { CambiaContrasenaComponent } from './cambia-contrasena.component';

describe('RegistrationFinishedPage', () => {
  let changePasswordSubject: Subject<boolean>;
  let verifingTokenSubject: Subject<boolean>;
  beforeEach(() => {
    changePasswordSubject = new Subject<boolean>();
    verifingTokenSubject = new Subject<boolean>();
    return MockBuilder(CambiaContrasenaComponent)
      .mock(RouterTestingModule)
      .mock(LayoutFormComponent)
      .mock(LabelControlComponent)
      .mock(PasswordModule)
      .mock(FormsModule)
      .mock(ReactiveFormsModule)
      .keep(FormBuilder)
      .keep(StorageService)
      .mock(RecuperaService, {
        ChangePassword: () => changePasswordSubject,
        VerifingToken: () => verifingTokenSubject,
      })
      .replace(HttpClientModule, HttpClientTestingModule);
  });

  it('should create', () => {
    const fixture = MockRender(CambiaContrasenaComponent);
    expect(fixture).toBeTruthy();
  });

  it('mensaje', () => {
    const fixture = MockRender(CambiaContrasenaComponent);
    const component = fixture.point.componentInstance;
    const swalAlertFire = swalAlert.fire;
    swalAlert.fire = jest.fn();
    component.mensaje('titulo', 'texto');

    expect(swalAlert.fire).toBeCalled();
    expect(swalAlert.fire).toBeCalledWith({
      title: 'titulo',
      html: 'texto',
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonText: 'Entiendo',
    });

    swalAlert.fire = swalAlertFire;
  });

  it('Verificar', () => {
    const fixture = MockRender(CambiaContrasenaComponent);
    const component = fixture.point.componentInstance;

    component.llave = '3173I1201910171716';

    const swalAlertFire = swalAlert.fire;
    swalAlert.fire = jest.fn();

    verifingTokenSubject.next(false);
    expect(swalAlert.fire).toBeCalled();
    expect(swalAlert.fire).toBeCalledWith({
      title: 'Enlace expirado',
      html: 'El enlace ya ha expirado o ha sido usado, puedes volver a solicitar otro para recuperar tu contraseña',
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonText: 'Entiendo',
    });

    swalAlert.fire = swalAlertFire;
  });

  it('SubmitCambia', () => {
    const fixture = MockRender(CambiaContrasenaComponent);
    const component = fixture.point.componentInstance;

    component.llave = '3173I1201910171716';

    component.Cambia.setValue({
      contrasena: '38373we@Q',
      repcontrasena: '38373we@Q',
    });

    const swalAlertFire = swalAlert.fire;
    swalAlert.fire = jest.fn();

    component.SubmitCambia();
    changePasswordSubject.next(true);

    expect(swalAlert.fire).toBeCalled();
    expect(swalAlert.fire).toBeCalledWith({
      title: 'Contraseña actualizada',
      html: 'Tu contraseña ha sido actualizada.',
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonText: 'Iniciar sesión',
    });
    swalAlert.fire = swalAlertFire;
  });

  it('SubmitCambia false', () => {
    const fixture = MockRender(CambiaContrasenaComponent);
    const component = fixture.point.componentInstance;

    component.llave = '3173I1201910171716';

    component.Cambia.setValue({
      contrasena: '38373we@Q',
      repcontrasena: '38373we@Q',
    });

    const swalAlertFire = swalAlert.fire;
    swalAlert.fire = jest.fn();

    component.SubmitCambia();

    changePasswordSubject.next(false);
    expect(swalAlert.fire).toBeCalled();
    expect(swalAlert.fire).toBeCalledWith({
      title: 'Actualizar Contraseña',
      html: 'Error al actualizar contraseña',
      showCloseButton: false,
      showCancelButton: false,
      showConfirmButton: true,
      confirmButtonText: 'Entiendo',
    });

    swalAlert.fire = swalAlertFire;
  });
});
