import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { type ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { MockComponent } from 'ng-mocks';

import { AfiliacionService } from '../../../../shared/services/afiliacion.service';
import { ServicesGTPComponent } from './services-gtp.component';

describe('ServicesGTPComponent', () => {
  let component: ServicesGTPComponent;
  let fixture: ComponentFixture<ServicesGTPComponent>;

  beforeEach(() => {
    void TestBed.configureTestingModule({
      declarations: [MockComponent(ServicesGTPComponent)],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserModule,
        CommonModule,
      ],
      providers: [AfiliacionService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ServicesGTPComponent);
    component = fixture.componentInstance;
    component.service = {
      id: 3440,
      res: null,
      name: 'Deuda DPWC',
      newName: '',
      newNameCode: '',
      debtorCode: 'RUC',
      dataType: 'P',
      paymentType: 'C',
      idAccount: '6522',
      accountNumber: '*********6522 (Soles)',
      currency: '001',
      useAppWeb: true,
      useAgent: true,
      useStore: false,
      partialPayment: 'N',
      chargeInterest: 'N',
      chargeType: 1,
      interestType: 'M',
      amount: 1,
      porcentage: null,
      currencySymbol: 'S/',
      inReview: false,
      status: 'Activo',
      acceptednewNameCode: null,
      acceptednewName: null,
      nombreHabilitado: true,
      nombreCodHabilitado: true,
      newNameGTPStatus: 1,
      newNameCodeGTPStatus: 1,
      nombre: 'Deuda DPWC',
      codDeudor: 'RUC',
      tipoDato: 'P',
      tipoPago: 'C',
      nroCuenta: '*********6522 (Soles)',
      moneda: '001',
      simboloMoneda: 'S/',
      usaWebApp: true,
      usaAgente: true,
      usaTienda: false,
      cobraMora: 'N',
      periodoMora: '1',
      tipoMora: 'M',
      monto: 1,
      porcentaje: null,
      pagoPartes: 'N',
      useAgencyChannel: false,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
