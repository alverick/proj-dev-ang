import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { of, throwError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import { MonedaModel, RubroModel, ServiceModel } from '../models';
import { DataEnterpriseModel } from '../models/data-enterprise.model';
import { drawPopup } from '../utils/helpers/popups';
import { StorageService } from './storage.service';

@Injectable()
export class AfiliacionService {
  private _currentIndex = -1;
  private _editMode = false;

  get currentIndex(): number {
    return this._currentIndex;
  }

  set currentIndex(value: number) {
    this._currentIndex = value;
  }

  set currentServiceModel(value: ServiceModel) {
    this._currentServiceModel = value;
  }

  get currentServiceModel(): ServiceModel {
    return this._currentServiceModel;
  }

  get editMode(): boolean {
    return this._editMode;
  }

  constructor(
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private storage: StorageService
  ) {
    // this.llenarMock();
  }

  public idCompany = 0;
  public email: string;
  public Guardado = false;

  public services: ServiceModel[] = [];
  private _rubros: RubroModel[] = null;
  private _rubrosAll: RubroModel[] = null;
  public dataEnterpriseModel: DataEnterpriseModel;
  private _currentServiceModel: ServiceModel;

  public Clear() {
    this.Guardado = false;
    this.services.push({
      nombre: 'Mensualidad',
      codDeudor: 'DNI',
      tipoDato: 'C',
      tipoPago: 'C',
      idCuenta: '',
      nroCuenta: '',
      moneda: '001',
      simboloMoneda: 'S/',
      usaWebApp: true,
      usaAgente: false,
      usaTienda: false,
      cobraMora: 'N',
      periodoMora: '1',
      tipoMora: 'M',
      pagoPartes: 'N',
    });
  }

  public CrearSevice(): ServiceModel {
    this.Guardado = false;
    let nombre = 'Mensualidad';
    const newName = 'Mensualidad';
    let nro = 1;
    this.services.forEach((s, i) => {
      // El startsWith()método determina si una cadena comienza con los caracteres de una cadena especificada.
      if (s.nombre === null) {
        if (s.newName.toUpperCase().startsWith(newName.toUpperCase())) {
          if (
            !isNaN(parseInt(s.newName.substr(newName.length))) ||
            s.newName.substr(newName.length) === ''
          ) {
            const aux = parseInt(s.newName.substr(newName.length));
            if (isNaN(aux)) {
              nro = 2;
            } else if (aux >= nro) {
              nro = aux + 1;
            }
          }
        }
      } else {
        if (s.nombre.toUpperCase().startsWith(nombre.toUpperCase())) {
          if (
            !isNaN(parseInt(s.nombre.substr(nombre.length))) ||
            s.nombre.substr(nombre.length) === ''
          ) {
            const aux = parseInt(s.nombre.substr(nombre.length));
            if (isNaN(aux)) {
              nro = 2;
            } else if (aux >= nro) {
              nro = aux + 1;
            }
          }
        }
      }
    });
    if (nro > 1) {
      nombre += nro.toString();
    }
    const svc: ServiceModel = {
      id: null,
      nombre,
      newName: nombre,
      codDeudor: 'DNI',
      // newNameCode: '',
      tipoDato: 'C',
      tipoPago: 'C',
      idCuenta: '',
      nroCuenta: '',
      newNameCodeGtpStatus: null,
      moneda: '001',
      simboloMoneda: 'S/',
      usaWebApp: true,
      usaAgente: false,
      usaTienda: false,
      cobraMora: 'N',
      periodoMora: '',
      tipoMora: 'M',
      pagoPartes: 'N',
    };
    this.services.push(svc);
    return svc;
  }

  public AddService(svc: ServiceModel) {
    this.Guardado = false;
    const svc_old = this.services.find((v) => v.nombre === svc.nombre);
    if (svc_old) {
      Swal.fire({
        text: 'Este servicio ya existe',
        allowOutsideClick: false,
        onOpen: drawPopup,
      });
    } else {
      this.services.push(svc);
    }
  }

  public DelService(index: number) {
    this.Guardado = false;
    this.services.splice(index, 1);
  }

  public SendDelService(index: number) {
    const url = `${environment.END_POINT}/service/${this.services[index].id}`;
    return this.http.post(url, null).pipe(
      map((r) => {
        this.services.splice(index, 1);
        return r;
      })
    );
  }

  public CanDeleteService(index: number) {
    const url = `${environment.END_POINT}/service/${this.services[index].id}/canDelete`;
    return this.http.get<any>(url);
  }

  public Registrar(data: any): Observable<any> {
    this.spinner.show();
    this.email = data.email;
    return this.http
      .post<any>(
        `${environment.END_POINT}/company?_=` + new Date().getTime(),
        data
      )
      .pipe(
        map((r) => {
          this.spinner.hide();
          if (r.success) {
            this.idCompany = r.id;
          }
          return r;
        })
      )
      .pipe(
        catchError((err) => {
          this.spinner.hide();
          return throwError(err);
        })
      );
  }

  public ValidateClient(data: any): Observable<any> {
    this.spinner.show();
    this.email = data.email;
    return this.http
      .post<any>(
        `${environment.END_POINT}/company/validate?_=` + new Date().getTime(),
        data
      )
      .pipe(
        map((r) => {
          this.spinner.hide();
          if (r.success) {
            this.idCompany = r.id;
          }
          return r;
        })
      )
      .pipe(
        catchError((err) => {
          this.spinner.hide();
          return throwError(err);
        })
      );
  }

  public GetRubros(): Observable<RubroModel[]> {
    if (this._rubros !== null) {
      return Observable.of(this._rubros);
    }
    return this.http
      .get<RubroModel[]>(
        `${environment.END_POINT}/enterpriseHeading?_=` + new Date().getTime()
      )
      .pipe(
        map((r) => {
          this._rubros = r;
          return r;
        })
      )
      .pipe(catchError((err) => throwError(err)));
  }

  public GetRubrosAll(): Observable<RubroModel[]> {
    // if (this._rubrosAll !== null) return Observable.of(this._rubrosAll);
    return this.http
      .get<RubroModel[]>(
        `${environment.END_POINT}/enterpriseHeading/all?_=` +
          new Date().getTime()
      )
      .pipe(
        map((r) => {
          this._rubrosAll = r;
          return r;
        })
      )
      .pipe(catchError((err) => throwError(err)));
  }

  public GetCodDeudor(): Observable<any[]> {
    return of<any[]>([
      {
        code: 'DNI',
        name: 'DNI',
      },
      {
        code: 'RUC',
        name: 'RUC',
      },
      {
        code: 'Codigo Interno',
        name: 'Celular',
      },
      {
        code: 'Otro',
        name: 'Otro (Cód. Interno, Cod. Alumno, N° de departamentos, etc.)',
      },
    ]);
  }

  public GetTipoDato(): Observable<any[]> {
    return of<any[]>([
      {
        code: 'C',
        name: 'Tengo su código, nombres y deuda',
      },
      {
        code: 'P',
        name: 'Tengo sólo código y nombres',
      },
      {
        code: 'S',
        name: 'No ingresaré data',
      },
    ]);
  }

  public GetPagoPartes(): Observable<any[]> {
    return of<any[]>([
      {
        code: 'N',
        name: 'No. Solo podrán pagarme la deuda/monto total.',
      },
      {
        code: 'S',
        name: 'Sí. Podrán pagarme una parte de la deuda/monto.',
      },
    ]);
  }

  public GetTipoPago(): Observable<any[]> {
    return of<any[]>([
      {
        code: 'C',
        name: 'Pueden elegir qué deuda quieren pagar',
      },
      {
        code: 'P',
        name: 'Siempre la deuda que vence primero',
      },
    ]);
  }

  public GetMoneda(): Observable<MonedaModel[]> {
    return of<MonedaModel[]>([
      {
        code: '001',
        name: 'Soles',
        symbol: 'S/',
      },
      {
        code: '002',
        name: 'Dólares',
        symbol: '$',
      },
    ]);
  }

  public GetPeriodoMora(): Observable<any[]> {
    return of<any[]>([
      {
        code: '1',
        name: 'Diario',
      },
      {
        code: '2',
        name: 'Fijo',
      },
    ]);
  }

  public GetCards(): Observable<any[]> {
    if (this.idCompany) {
      return this.http.get<any[]>(
        `${environment.END_POINT}/company/${
          this.idCompany
        }/cards?_=${new Date().getTime()}`
      );
    }
    return this.http.get<any[]>(
      `${environment.END_POINT}/company/cards?_=${new Date().getTime()}`
    );
  }

  public GetServicios(incDeactivates: boolean = false) {
    const headers: any = {
      'Ocp-Apim-Subscription-Key': environment.OCP_KEY,
      'Ocp-Apim-Trace': 'true',
    };
    if (this.storage.isAuthenticated) {
      headers['Authorization'] = 'bearer ' + this.storage.getCurrentToken();
    }
    this.http
      .get<any[]>(
        `${environment.END_POINT}/company/service?incDeactivates=${incDeactivates}&_=` +
          new Date().getTime(),
        { headers }
      )
      .subscribe((d) => {
        const servicios = [];
        d.forEach((s) => {
          servicios.push({
            id: s.id,
            nombre: s.name,
            res: s.res === null ? '' : s.res,
            newName: s.newName,
            newNameCode: s.newNameCode,
            rubro: s.entry,
            codDeudor: s.debtorCode,
            tipoDato: s.dataType,
            tipoPago: s.paymentType,
            idCuenta: s.idAccount,
            nroCuenta: s.accountNumber, // `${s.accountNumber} (${(s.currency === '001' ? 'soles' : 'dolares' )})`,
            moneda: s.currency,
            simboloMoneda: s.currencySymbol,
            usaWebApp: s.useAppWeb,
            usaAgente: s.useAgent,
            usaTienda: s.useStore,
            cobraMora: s.chargeInterest,
            periodoMora: s.chargeType.toString(),
            tipoMora: s.interestType,
            monto: s.amount,
            porcentaje: s.percentage,
            inReview: s.inReview,
            pagoPartes: s.partialPayment,
            newNameGtpStatus: s.newNameGTPStatus,
            newNameCodeGtpStatus: s.newNameCodeGTPStatus,
            nombreHabilitado: !(
              s.newNameGTPStatus === 1 || s.newNameGTPStatus === 3
            ),
            nombreCodHabilitado: !(
              s.newNameCodeGTPStatus === 1 || s.newNameCodeGTPStatus === 3
            ),
            useAgencyChannel: s.useAgencyChannel,
          });
        });
        this.services = servicios;
      });
  }

  public GrabarServicios(): Observable<any> {
    let codigo;
    this.spinner.show();
    const data = { clientId: this.idCompany, services: [], deleted: [] };
    this.services.forEach((s) => {
      let name = '';
      if (s.nombre === null) {
        name = s.newName;
      } else if (s.nombre === '?') {
        name = '';
      } else {
        name = s.nombre;
      }
      data.services.push({
        id: s.id,
        name,
        newName: s.newName,
        entry: s.rubro,
        debtorCode:
          s.codDeudor === '?'
            ? ''
            : s.codDeudor === 'Otro'
            ? s.nameCod
            : s.codDeudor,
        //   debtorCode: ( s.codDeudor === 'Otro') ? s.nameCod : s.codDeudor ,
        newNameCode: s.newNameCode,
        dataType: s.tipoDato,
        paymentType: s.tipoPago,
        idAccount: s.idCuenta,
        accountNumber: s.nroCuenta,
        currency: s.moneda,
        useAppWeb: s.usaWebApp,
        useAgent: s.usaAgente,
        useStore: s.usaTienda,
        chargeInterest: s.cobraMora,
        chargeType: s.periodoMora,
        interestType: s.tipoMora,
        amount: s.monto,
        percentage: s.porcentaje,
        partialPayment: s.pagoPartes,
      });
    });

    return this.http
      .post<any>(
        `${environment.END_POINT}/company/service?_=` + new Date().getTime(),
        data
      )
      .pipe(
        map((r) => {
          this.spinner.hide();
          this.Guardado = true;
          return r;
        })
      )
      .pipe(
        catchError((err) => {
          this.spinner.hide();
          throw throwError(err);
        })
      );
  }

  Descartar(indice: number, isNew: boolean) {
    this.Guardado = false;
    if (
      isNew &&
      this.services.length > 1 &&
      indice >= 0 &&
      indice === this.services.length - 1
    ) {
      const svc = this.services[this.services.length - 1];
      if (svc.id === null || svc.id === undefined || svc.id < 0) {
        this.services.pop();
      }
    }
  }

  GetTipoCambio(): Observable<number> {
    return Observable.of(3.37);
  }

  IniciarServicios() {
    if (this.storage.isAuthenticated()) {
      delete this.idCompany;
    }
  }

  addCurrentServiceModel() {
    this.Guardado = false;
    const svc_old = this.services.find(
      (v) => v.nombre === this._currentServiceModel.nombre
    );
    if (svc_old) {
      Swal.fire({
        text: 'Este servicio ya existe',
        allowOutsideClick: false,
        onOpen: drawPopup,
      });
    } else {
      this.services.push(this._currentServiceModel);
      this._currentServiceModel = null;
    }
  }

  public createNewService(useAgencyChannel: boolean = false): void {
    this.Guardado = false;
    this._currentServiceModel = null;
    let nombre = 'Mensualidad';
    const newName = 'Mensualidad';
    let nro = 1;
    this.services.forEach((s, i) => {
      // El startsWith()método determina si una cadena comienza con los caracteres de una cadena especificada.
      if (s.nombre === null) {
        if (s.newName.toUpperCase().startsWith(newName.toUpperCase())) {
          if (
            !isNaN(parseInt(s.newName.substr(newName.length))) ||
            s.newName.substr(newName.length) === ''
          ) {
            const aux = parseInt(s.newName.substr(newName.length));
            if (isNaN(aux)) {
              nro = 2;
            } else if (aux >= nro) {
              nro = aux + 1;
            }
          }
        }
      } else {
        if (s.nombre.toUpperCase().startsWith(nombre.toUpperCase())) {
          if (
            !isNaN(parseInt(s.nombre.substr(nombre.length))) ||
            s.nombre.substr(nombre.length) === ''
          ) {
            const aux = parseInt(s.nombre.substr(nombre.length));
            if (isNaN(aux)) {
              nro = 2;
            } else if (aux >= nro) {
              nro = aux + 1;
            }
          }
        }
      }
    });
    if (nro > 1) {
      nombre += nro.toString();
    }
    // tipoDato: "C",
    // tipoPago: "C",
    // codDeudor: "DNI",
    // cobraMora: 'N'
    // nombre: nombre,
    // newName: nombre,
    // newNameCodeGtpStatus: null,
    const svc: ServiceModel = {
      res: '',
      id: null,
      nombre: '',
      newName: '',
      codDeudor: '',
      newNameCode: '',
      tipoDato: '',
      tipoPago: '',
      idCuenta: '',
      nroCuenta: '',
      // newNameCodeGtpStatus: null,
      moneda: '001',
      simboloMoneda: 'S/',
      usaWebApp: true,
      usaAgente: false,
      usaTienda: false,
      cobraMora: '',
      periodoMora: '1',
      tipoMora: 'M',
      pagoPartes: 'N',
      nombreCodHabilitado: false,
      useAgencyChannel,
    };

    this._currentServiceModel = svc;
    // this.services.push(svc);
  }

  /*this._service = {
    res: "",
    nombre: "",
    codDeudor: "",
    tipoDato: "",
    tipoPago: "",
    idCuenta: "",
    nroCuenta: "",
    moneda: "001",
    simboloMoneda: "S/",
    usaWebApp: true,
    usaAgente: false,
    usaTienda: false,
    cobraMora: "",
    periodoMora: "1",
    tipoMora: "M",
    nombreCodHabilitado: false,
    newNameCode: ''
  };*/

  llenarMock() {
    const currentService: ServiceModel = {
      cobraMora: 'N',
      codDeudor: 'DNI',
      id: null,
      idCuenta: '4708',
      moneda: '002',
      monto: 1.0,
      newName: 'AGUA',
      newNameCode: 'DNI',
      nombre: 'AGUA',
      nombreCodHabilitado: false,
      nroCuenta: '*********4708 (Dólares)',
      pagoPartes: 'N',
      periodoMora: '',
      porcentaje: 1.0,
      res: '',
      simboloMoneda: '$',
      tipoDato: 'C',
      tipoMora: 'M',
      tipoPago: 'C',
      usaAgente: true,
      usaTienda: true,
      usaWebApp: true,
    };
    this.services.push(currentService);

    const currentService02: ServiceModel = {
      cobraMora: 'N',
      codDeudor: 'DNI',
      id: null,
      idCuenta: '4708',
      moneda: '002',
      monto: 1.0,
      newName:
        'AGUA AGUA AGUA  AGUA AGUA AGUA AGUAAGUA  AGUA AGUA AGUA AGUA AGUA ',
      newNameCode: 'DNI',
      nombre:
        'AGUA AGUA AGUA  AGUA AGUA AGUA AGUAAGUA  AGUA AGUA AGUA AGUA AGUA ',
      nombreCodHabilitado: false,
      nroCuenta: '*********4708 (Dólares)',
      pagoPartes: 'N',
      periodoMora: '',
      porcentaje: 1.0,
      res: '',
      simboloMoneda: '$',
      tipoDato: 'C',
      tipoMora: 'M',
      tipoPago: 'C',
      usaAgente: true,
      usaTienda: true,
      usaWebApp: true,
    };
    this.services.push(currentService02);
  }
}
