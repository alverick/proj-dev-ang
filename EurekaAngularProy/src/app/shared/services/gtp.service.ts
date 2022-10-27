import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import moment from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { isNilOrEmpty } from 'ramda-adjunct';
import { of, throwError, Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { ServiceModel } from '../models';
import { CorreoGtpModel } from '../models/data-correoGtp';
import { DataEnterpriseGTP } from '../models/data-enterprise-gtp';
import { DataGTPChange } from '../models/data-gtpchange';
import { DataServiceGTP } from '../models/data-service-gtp';
import { EnterprisesPagedList } from '../models/enterprises-gtp';
import { GtpFilter } from '../models/gtp-filter';
import { StatesGtp } from '../models/states-gtp';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class GtpService {
  private lastFilter: GtpFilter = null;
  private URI_API: string = environment.END_POINT;
  public pageMessage = 'Mostrando 0 de 0 elementos';

  constructor(
    private http: HttpClient,
    private storage: StorageService,
    private spinner: NgxSpinnerService
  ) {}
  /// para los servicios que estan en eprobacin
  public services: DataServiceGTP[] = [];
  public Service: DataServiceGTP;

  public EnterprisesItems: EnterprisesPagedList = {
    totalCompanies: 0,
    listCompanyGTP: [],
  };
  // public emp: DataGTPChange;
  public llave: string;
  public nombre: string;
  public EdtEmpServ: DataGTPChange;
  public EmpresaServicios: DataEnterpriseGTP;
  private States: StatesGtp[] = [
    { idState: 'Pendiente', descripcion: 'Pendiente' },
    { idState: 'Atendido', descripcion: 'Atendido' },
    { idState: 'Devuelto a la empresa', descripcion: 'Devuelto a la Empresa' },
    { idState: 'Rechazado', descripcion: 'Rechazado' },
    { idState: 'Desafiliado', descripcion: 'Desafiliado' },
  ];

  private tiposSolicitudes: StatesGtp[] = [
    { idState: 'EmpNuevo', descripcion: 'Empresa Nueva' },
    { idState: 'EmpMod', descripcion: 'Actualización de Empresa' },
    { idState: 'SvcMod', descripcion: 'Actualización de Servicios' },
    { idState: 'SvcNuevo', descripcion: 'Nuevos Servicios' },
  ];

  getStates(): Observable<StatesGtp[]> {
    return of(this.States);
  }

  getTipoSolicitudes(): Observable<StatesGtp[]> {
    return of(this.tiposSolicitudes);
  }

  // opcional
  getEmpresas(filtro: GtpFilter = null): Observable<EnterprisesPagedList> {
    // si es nulo que aplique el ultimo filtro
    if (filtro === null) {
      filtro = this.lastFilter;
    } else {
      this.lastFilter = filtro;
    }
    const strDateFrom = isNilOrEmpty(filtro.dateFrom)
      ? ''
      : encodeURI(moment(filtro.dateFrom).format('YYYY/MM/DD'));
    const strDateTo = isNilOrEmpty(filtro.dateTo)
      ? ''
      : encodeURI(moment(filtro.dateTo).format('YYYY/MM/DD'));

    if (isNilOrEmpty(filtro.BusinessHeading)) {
      filtro.BusinessHeading = '';
    }
    if (isNilOrEmpty(filtro.status)) {
      filtro.status = '';
    }
    const url = `${this.URI_API}/Company/GTP/list?PageNumber=${filtro.pageNumber}&ColumnName=${filtro.ColumnName}&Asc=${filtro.asc}&InputSearch=${filtro.inputSearch}&BusinessHeading=${filtro.BusinessHeading}&Status=${filtro.status}&Solicitud=${filtro.statusSolicitud}&DateFrom=${strDateFrom}&DateTo=${strDateTo}`;
    return this.http
      .get<EnterprisesPagedList>(url)
      .pipe(
        map((r) => {
          this.EnterprisesItems = r;
          return r;
        })
      )
      .pipe(
        map((r) => {
          if (r.totalCompanies === 0) {
            this.pageMessage = 'Mostrando 0 de 0 elementos';
          } else {
            // (1 - 1*50)+1 =1
            const beg = (filtro.pageNumber - 1) * 50 + 1;
            // 1*50=50
            let end = filtro.pageNumber * 50;
            // 50 > 150
            if (end > r.totalCompanies) {
              end = r.totalCompanies;
            }
            // Mostrando 1 - 50 de 1s50 elemtos
            this.pageMessage = `Mostrando ${beg} - ${end} de ${r.totalCompanies} elementos`;
          }
          return r;
        })
      )
      .pipe(catchError((error) => throwError(error)));
  }

  GetEnterpriseGtp(id: any): Observable<DataEnterpriseGTP> {
    const url = `${environment.END_POINT}/company/GTP/client/${id}`;
    return this.http
      .get<DataEnterpriseGTP>(url)
      .pipe(
        map((r) => {
          return r;
        })
      )
      .pipe(catchError((err) => throwError(err)));
  }

  GetEnterpriseGtp2(id: any): Observable<any> {
    const url = `${environment.END_POINT}/company/GTP/client/${id}`;
    return this.http
      .get<any>(url)
      .pipe(
        map((r) => {
          return r;
        })
      )
      .pipe(catchError((err) => throwError(err)));
  }

  GetServicesGtp(enterpriseId: any) {
    this.services = [];
    const url = `${
      environment.END_POINT
    }/company/GTP/services/${enterpriseId}/${false}`;
    this.http.get<any[]>(url).subscribe((service) => {
      const servicios = [];
      service.forEach(
        ({
          accountNumber,
          amount,
          chargeInterest,
          chargeType,
          currency,
          currencySymbol,
          dataType,
          debtorCode,
          entry,
          id,
          idAccount,
          inReview,
          interestType,
          name,
          newName,
          newNameCode,
          newNameCodeGTPStatus,
          newNameGTPStatus,
          partialPayment,
          paymentType,
          percentage,
          res,
          status,
          useAgent,
          useAppWeb,
          useStore,
        }) => {
          servicios.push({
            id,
            res,
            name,
            newName,
            newNameCode,
            debtorCode,
            dataType,
            paymentType,
            idAccount,
            accountNumber,
            currency,
            useAppWeb,
            useAgent,
            useStore,
            partialPayment,
            chargeInterest,
            chargeType: chargeType.toString(),
            interestType,
            amount,
            porcentage: percentage,
            currencySymbol,
            inReview,
            status,
            acceptednewNameCode: null,
            acceptednewName: null,
            nombreHabilitado: name !== newName,
            nombreCodHabilitado: debtorCode !== newNameCode,
            newNameGTPStatus,
            newNameCodeGTPStatus,
            nombre: name,
            rubro: entry,
            codDeudor: debtorCode,
            tipoDato: dataType,
            tipoPago: paymentType,
            nroCuenta: accountNumber,
            moneda: currency,
            simboloMoneda: currencySymbol,
            usaWebApp: useAppWeb,
            usaAgente: useAgent,
            usaTienda: useStore,
            cobraMora: chargeInterest,
            periodoMora: chargeType.toString(),
            tipoMora: interestType,
            monto: amount,
            porcentaje: percentage,
            pagoPartes: partialPayment,
          });
        }
      );
      this.services = servicios;
    });
  }

  public AprobarEmpresaServ(data: any): Observable<any> {
    this.spinner.show();
    return this.http
      .post<any>(`${environment.END_POINT}/company/gtp/approve`, data)
      .pipe(
        map((r) => {
          this.spinner.hide();
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

  /*ESTO ME TRAE EN LA CORRECION*/

  public GetEnterpriseServices(data: any): Observable<any> {
    this.spinner.show();
    return this.http
      .post<any>(`${environment.END_POINT}/Login/dencrypt`, data)
      .pipe(
        map((r) => {
          this.spinner.hide();
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

  public EditChangeGTP(data: any) {
    this.spinner.show();
    return this.http
      .post<any>(`${environment.END_POINT}/company/gtp/client/update`, data)
      .pipe(
        map((r) => {
          this.spinner.hide();
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

  public CrearSevice(): ServiceModel {
    let nombre = 'Mensualidad';
    let nro = 1;
    this.services.forEach((s) => {
      // El startsWith()método determina si una cadena comienza con los caracteres de una cadena especificada.
      if (s.nombre.toUpperCase().startsWith(nombre.toUpperCase())) {
        if (
          !isNaN(parseInt(s.nombre.substr(nombre.length), 10)) ||
          s.nombre.substr(nombre.length) === ''
        ) {
          const aux = parseInt(s.nombre.substr(nombre.length), 10);
          if (isNaN(aux)) {
            nro = 2;
          } else if (aux >= nro) {
            nro = aux + 1;
          }
        }
      }
    });
    if (nro > 1) {
      nombre += nro.toString();
    }
    const svc: any = {
      id: null,
      nombre,
      newName: nombre,
      codDeudor: 'DNI',
      // newNameCode: '',
      tipoDato: 'C',
      tipoPago: 'C',
      idCuenta: 0,
      nroCuenta: '',
      moneda: '001',
      simboloMoneda: 'S/',
      usaWebApp: true,
      usaAgente: false,
      usaTienda: false,
      cobraMora: 'N',
      periodoMora: '',
      tipoMora: 'M',
      pagoPartes: 'N',
      acceptednewName: null,
      acceptednewNameCode: null,
      inReview: true,
      name: '?',
      debtorCode: '?',
    };
    this.services.push(svc);
    return svc;
  }

  Descartar(indice: number, isNew: boolean) {
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

  public DelService(index: number) {
    this.services.splice(index, 1);
  }

  public SendDelService(index: number) {
    const url = `${environment.END_POINT}/service/${this.services[index].id}`;
    return this.http.delete(url).pipe(
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

  public GrabarServicios(id: number, emp: DataEnterpriseGTP): Observable<any> {
    this.spinner.show();
    const data = { clientId: id, company: emp, services: [], deleted: [] };
    this.services.forEach((s) => {
      data.services.push({
        id: s.id,
        res: s.res,
        name: s.nombre,
        newName: s.newName,
        entry: s.rubro,
        debtorCode: s.codDeudor === 'Otro' ? s.nameCod : s.codDeudor,
        newNameCode: s.newNameCode,
        dataType: s.tipoDato,
        paymentType: s.tipoPago,
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
      .post<any>(`${environment.END_POINT}/company/GTP/company/update`, data)
      .pipe(
        map((r) => {
          this.spinner.hide();
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

  public ReenviarPAG(clientId: number): Observable<any> {
    this.spinner.show();
    return this.http
      .post<any>(
        `${environment.END_POINT}/company/GTP/client/${clientId}/pag`,
        {}
      )
      .pipe(
        map((r) => {
          this.spinner.hide();
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

  public clientsUnregistered(filtro: GtpFilter): Observable<any> {
    const url = `${environment.END_POINT}/company/GTP/client/unregistered`;
    const strDateFrom =
      filtro.dateFrom === null
        ? ''
        : moment(filtro.dateFrom).format('YYYY/MM/DD');
    const strDateTo =
      filtro.dateTo === null ? '' : moment(filtro.dateTo).format('YYYY/MM/DD');
    return this.http
      .post(
        url,
        { inicio: strDateFrom, final: strDateTo },
        {
          responseType: 'blob',
        }
      )
      .pipe(catchError((err) => throwError(err)));
  }

  public GetCorreoGtp(): Observable<CorreoGtpModel[]> {
    const url = `${environment.END_POINT}/company/GTP/emailgtp`;
    return this.http
      .get<any>(url)
      .pipe<CorreoGtpModel[]>(map((r) => r.emails))
      .pipe(catchError((err) => throwError(err)));
  }

  public PostConfigurarCorreoGtp(correos: CorreoGtpModel[]): Observable<any> {
    const url = `${environment.END_POINT}/company/GTP/emailgtp`;
    return this.http
      .post(url, { emails: correos })
      .pipe(catchError((err) => throwError(err)));
  }

  saveDatosEmpresa(data: any): Observable<any> {
    const url = `${environment.END_POINT}/company/GTP/company/data`;
    return this.http.post(url, data).pipe(catchError((err) => throwError(err)));
  }
}
