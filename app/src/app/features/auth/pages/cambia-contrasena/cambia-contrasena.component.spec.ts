import { HttpClientTestingModule } from '@angular/common/http/testing';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Subject } from 'rxjs';

import { RecuperaService } from '../../../../shared/services/recupera.service';
import { StorageService } from '../../../../shared/services/storage.service';
import { TrackingService } from '../../../../shared/services/tracking.service';
import { swalAlert } from '../../../../shared/utils/helpers/popups';
import { CambiaContrasenaComponent } from './cambia-contrasena.component';

describe('CambiaContrasenaPage', () => {
  let component: CambiaContrasenaComponent;
  let fixture: ComponentFixture<CambiaContrasenaComponent>;
  let changePasswordSubject: Subject<boolean>;
  let verifingTokenSubject: Subject<boolean>;

  beforeEach(async () => {
    changePasswordSubject = new Subject<boolean>();
    verifingTokenSubject = new Subject<boolean>();

    await TestBed.configureTestingModule({
      imports: [
        CambiaContrasenaComponent,
        RouterTestingModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        HttpClientTestingModule,
      ],
      providers: [
        FormBuilder,
        StorageService,
        {
          provide: RecuperaService,
          useValue: {
            ChangePassword: () => changePasswordSubject,
            VerifingToken: () => verifingTokenSubject,
          },
        },
        { provide: TrackingService, useValue: { trackEvent: jest.fn() } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CambiaContrasenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('mensaje', () => {
    const swalAlertFire = swalAlert.fire;
    swalAlert.fire = jest.fn();
    component.mensaje('titulo', 'texto');

    expect(swalAlert.fire).toHaveBeenCalled();
    expect(swalAlert.fire).toHaveBeenCalledWith({
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
    component.llave = '3173I1201910171716';

    const swalAlertFire = swalAlert.fire;
    swalAlert.fire = jest.fn();

    verifingTokenSubject.next(false);
    expect(swalAlert.fire).toHaveBeenCalled();
    expect(swalAlert.fire).toHaveBeenCalledWith({
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
    component.llave = '3173I1201910171716';

    component.Cambia.setValue({
      contrasena: '38373we@Q',
      repcontrasena: '38373we@Q',
    });

    const swalAlertFire = swalAlert.fire;
    swalAlert.fire = jest.fn().mockResolvedValue({ isConfirmed: true });

    component.SubmitCambia();
    changePasswordSubject.next(true);

    expect(swalAlert.fire).toHaveBeenCalled();
    expect(swalAlert.fire).toHaveBeenCalledWith({
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
    component.llave = '3173I1201910171716';

    component.Cambia.setValue({
      contrasena: '38373we@Q',
      repcontrasena: '38373we@Q',
    });

    const swalAlertFire = swalAlert.fire;
    swalAlert.fire = jest.fn();

    component.SubmitCambia();

    changePasswordSubject.next(false);
    expect(swalAlert.fire).toHaveBeenCalled();
    expect(swalAlert.fire).toHaveBeenCalledWith({
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
