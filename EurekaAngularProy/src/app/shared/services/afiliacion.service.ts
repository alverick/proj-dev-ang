import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { isEmpty, isNil } from 'ramda';
import { of, throwError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
import {
  IEntryModel,
  IServiceModel,
  IServiceRemoteModel,
  MonedaModel,
} from '../models';
import { IDataEnterpriseModel } from '../models/data-enterprise.model';
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

  set currentServiceModel(value: IServiceModel) {
    this._currentServiceModel = value;
  }

  get currentServiceModel(): IServiceModel {
    return this._currentServiceModel;
  }

  get editMode(): boolean {
    return this._editMode;
  }

  constructor(
    private http: HttpClient,
    private spinner: NgxSpinnerService,
    private storage: StorageService
  ) {}

  public idCompany = 0;
  public email: string;
  public Guardado = false;

  public services: IServiceModel[] = [];
  private _rubros: IEntryModel[] = null;
  private _rubrosAll: IEntryModel[] = null;
  public dataEnterpriseModel: IDataEnterpriseModel;
  private _currentServiceModel: IServiceModel;

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

  public CrearSevice(): IServiceModel {
    this.Guardado = false;
    let nombre = 'Mensualidad';
    const newName = 'Mensualidad';
    let nro = 1;

    const parseName: (
      nameObj: string,
      nameVar: string,
      nameNumber: number
    ) => number = (nameObj, nameVar, nameNumber) => {
      if (nameObj.toUpperCase().startsWith(nameVar.toUpperCase())) {
        if (
          !isNaN(parseInt(nameObj.substr(nameVar.length), 10)) ||
          nameObj.substr(nameVar.length) === ''
        ) {
          const aux = parseInt(nameObj.substr(nameVar.length), 10);
          if (isNaN(aux)) {
            nameNumber = 2;
          } else if (aux >= nameNumber) {
            nameNumber = aux + 1;
          }
        }
      }
      return nameNumber;
    };

    this.services.forEach((s) => {
      // El startsWith()método determina si una cadena comienza con los caracteres de una cadena especificada.
      nro = isNil(s.nombre)
        ? parseName(s.newName, newName, nro)
        : parseName(s.nombre, nombre, nro);
    });
    if (nro > 1) {
      nombre += nro.toString();
    }
    const svc: IServiceModel = {
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

  public AddService(svc: IServiceModel) {
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

  setIdCompany(result) {
    this.spinner.hide();
    if (result.success) {
      this.idCompany = result.id;
    }
    return result;
  }

  public Registrar(data: any): Observable<any> {
    this.spinner.show();
    this.email = data.email;
    return this.http
      .post<any>(`${environment.END_POINT}/company`, data)
      .pipe(map((r) => this.setIdCompany(r)))
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
      .post<any>(`${environment.END_POINT}/company/validate`, data)
      .pipe(map((r) => this.setIdCompany(r)))
      .pipe(
        catchError((err) => {
          this.spinner.hide();
          return throwError(err);
        })
      );
  }

  public GetRubros(): Observable<IEntryModel[]> {
    if (this._rubros !== null) {
      return of(this._rubros);
    }
    return this.http
      .get<IEntryModel[]>(`${environment.END_POINT}/enterpriseHeading`)
      .pipe(
        map((r) => {
          this._rubros = r;
          return r;
        })
      )
      .pipe(catchError((err) => throwError(err)));
  }

  public GetRubrosAll(): Observable<IEntryModel[]> {
    return this.http
      .get<IEntryModel[]>(`${environment.END_POINT}/enterpriseHeading/all`)
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
        `${environment.END_POINT}/company/${this.idCompany}/cards`
      );
    }
    return this.http.get<any[]>(`${environment.END_POINT}/company/cards`);
  }

  public GetServicios(incDeactivates: boolean = false) {
    this.http
      .get<any[]>(
        `${environment.END_POINT}/company/service?incDeactivates=${incDeactivates}`
      )
      .subscribe((d: IServiceRemoteModel[]) => {
        const servicios: IServiceModel[] = [];
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

  public isServiceInReview(
    {
      id,
      newName,
      newNameCode,
      newNameCodeGtpStatus,
      newNameGtpStatus,
    }: IServiceModel,
    ignoreEditedLocally = false
  ): boolean {
    if (id === null) {
      return true;
    }
    if (!ignoreEditedLocally && (newName !== '' || newNameCode !== '')) {
      return true;
    }
    if (
      newNameGtpStatus === 1 &&
      newNameCodeGtpStatus === 1 &&
      newName === ''
    ) {
      return false;
    }
    if (
      (newNameGtpStatus === 0 || newNameGtpStatus === 2) &&
      (newNameCodeGtpStatus === 0 || newNameCodeGtpStatus === 2)
    ) {
      return true;
    }
    return false;
  }

  public isNewService({ id, res }: IServiceModel) {
    return isNil(id) && isEmpty(res);
  }

  public GrabarServicios(): Observable<any> {
    this.spinner.show();
    const data: {
      clientId: number;
      deleted: any[];
      services: IServiceRemoteModel[];
    } = {
      clientId: this.idCompany,
      services: [],
      deleted: [],
    };
    this.services
      .filter(
        (service) =>
          !this.isServiceInReview(service, true) || this.isNewService(service)
      )
      .forEach(
        ({
          cobraMora,
          codDeudor,
          id,
          idCuenta,
          moneda,
          monto,
          nameCod,
          newName,
          newNameCode,
          nombre,
          nroCuenta,
          pagoPartes,
          periodoMora,
          porcentaje,
          rubro,
          tipoDato,
          tipoMora,
          tipoPago,
          usaAgente,
          usaTienda,
          usaWebApp,
        }) => {
          let name = '';
          if (nombre === null) {
            name = newName;
          } else if (nombre !== '?') {
            name = nombre;
          }
          let debtorCode;
          switch (codDeudor) {
            case '?':
              debtorCode = '';
              break;
            case 'Otro':
              debtorCode = nameCod;
              break;
            case null:
              debtorCode = 'DNI';
              break;
            default:
              debtorCode = codDeudor;
              break;
          }
          data.services.push({
            id,
            name,
            newName,
            entry: rubro,
            debtorCode,
            newNameCode,
            dataType: tipoDato,
            paymentType: tipoPago,
            idAccount: idCuenta,
            accountNumber: nroCuenta,
            currency: moneda,
            useAppWeb: usaWebApp,
            useAgent: usaAgente,
            useStore: usaTienda,
            chargeInterest: cobraMora,
            chargeType: parseInt(periodoMora, 10),
            interestType: tipoMora,
            amount: monto,
            percentage: porcentaje,
            partialPayment: pagoPartes,
          });
        }
      );

    return this.http
      .post<any>(`${environment.END_POINT}/company/service`, data)
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
    return of(3.37);
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
    this._currentServiceModel = {
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
  }
}
