import { HttpClient, type HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import moment from 'moment';
import { isNilOrEmpty } from 'ramda-adjunct';
import { type Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { type ICompanyData } from '../models/company-data';
import { type CorreoGtpModel } from '../models/data-correoGtp';
import { type DataGTPChange } from '../models/data-gtpchange';
import { type DataServiceGTP } from '../models/data-service-gtp';
import { type EnterprisesPagedList } from '../models/enterprises-gtp';
import { type GtpFilter } from '../models/gtp-filter';
import { type StatesGtp } from '../models/states-gtp';

@Injectable()
export class GtpService {
  private lastFilter: GtpFilter = null;
  private URI_API: string = environment.END_POINT;
  public pageMessage = 'Mostrando 0 de 0 elementos';

  constructor(private http: HttpClient) {}
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
  public EmpresaServicios: ICompanyData;
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
      filtro.status = [];
    }
    const url = `${this.URI_API}/Company/GTP/list?PageNumber=${filtro.pageNumber}&ColumnName=${filtro.ColumnName}&Asc=${filtro.asc}&InputSearch=${filtro.inputSearch}&BusinessHeading=${filtro.BusinessHeading}&Status=${filtro.status}&Solicitud=${filtro.statusSolicitud}&DateFrom=${strDateFrom}&DateTo=${strDateTo}`;
    return this.http
      .get<EnterprisesPagedList>(url)
      .pipe(
        map((r) => {
          this.EnterprisesItems = r;
          return r;
        }),
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
        }),
      )
      .pipe(catchError((err: HttpErrorResponse) => throwError(() => err)));
  }

  GetEnterpriseGtp(id: any) {
    const url = `${environment.END_POINT}/company/GTP/client/${id}`;
    return this.http
      .get<ICompanyData>(url)
      .pipe(
        map((r) => {
          return r;
        }),
      )
      .pipe(catchError((err: HttpErrorResponse) => throwError(() => err)));
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
            chargeType: chargeType?.toString(),
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
        },
      );
      this.services = servicios;
    });
  }

  public AprobarEmpresaServ(data: any): Observable<any> {
    return this.http
      .post<any>(`${environment.END_POINT}/company/gtp/approve`, data)
      .pipe(
        map((r) => {
          return r;
        }),
      )
      .pipe(catchError((err: HttpErrorResponse) => throwError(() => err)));
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

  public ReenviarPAG(clientId: number): Observable<any> {
    return this.http
      .post<any>(
        `${environment.END_POINT}/company/GTP/client/${clientId}/pag`,
        {},
      )
      .pipe(
        map((r) => {
          return r;
        }),
      )
      .pipe(catchError((err: HttpErrorResponse) => throwError(() => err)));
  }

  public clientsUnregistered(filtro: GtpFilter) {
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
        },
      )
      .pipe(catchError((err: HttpErrorResponse) => throwError(() => err)));
  }

  public GetCorreoGtp() {
    const url = `${environment.END_POINT}/company/GTP/emailgtp`;
    return this.http.get<{ emails: CorreoGtpModel[] }>(url).pipe(
      map((r) => r.emails),
      catchError((err: HttpErrorResponse) => throwError(() => err)),
    );
  }

  public PostConfigurarCorreoGtp(correos: CorreoGtpModel[]) {
    const url = `${environment.END_POINT}/company/GTP/emailgtp`;
    return this.http
      .post(url, { emails: correos })
      .pipe(catchError((err: HttpErrorResponse) => throwError(() => err)));
  }

  saveDatosEmpresa(data: any) {
    const url = `${environment.END_POINT}/company/GTP/company/data`;
    return this.http
      .post(url, data)
      .pipe(catchError((err: HttpErrorResponse) => throwError(() => err)));
  }
}
