import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { clone, isNil } from 'ramda';
import { isNilOrEmpty } from 'ramda-adjunct';
import { type Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { type Debts, type DebtsPagedList } from '../models/debts';
import { type DebtEdit } from '../models/debts-edit.model';
import { type DebstFilter } from '../models/debts-filter.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private URI_API: string = environment.END_POINT;
  private lastFilter: DebstFilter = null;

  constructor(public http: HttpClient) {}

  public pageMessage = 'Mostrando 0 de 0 elementos';
  public debtItemsOriginal: DebtsPagedList = {
    count: 0,
    countNoIbkPayments: 0,
    data: [],
  };
  public debtItems: DebtsPagedList = {
    count: 0,
    countNoIbkPayments: 0,
    data: [],
  };
  public itemsForDelete: number[] = [];

  getDateFormat(date: Date): string {
    if (date) {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      let str = day > 9 ? day.toString() : '0' + day.toString();
      str += '%2F' + (month > 9 ? month.toString() : '0' + month.toString());
      str += '%2F' + year.toString();
      return str;
    }
    return '';
  }

  // opcional

  private mustBeSelected(d: Debts, selectedUniverse: boolean = false): boolean {
    if (d.hasIBKPayments || d.status === 'PAGADO') {
      return false;
    }
    return selectedUniverse || this.itemsForDelete.indexOf(d.id) >= 0;
  }

  getDeuda(
    filtro: DebstFilter = null,
    selectedUniverse: boolean = false
  ): Observable<any> {
    // ultimo filtro aplicado
    if (filtro === null) {
      filtro = this.lastFilter;
    } else {
      // el nuevo filtro
      this.lastFilter = filtro;
    }
    const processDate = (value: string | Date) => {
      return isNilOrEmpty(value)
        ? ''
        : encodeURI(moment(value).format('YYYY/MM/DD'));
    };
    const strDateFrom = processDate(filtro.dateFrom);
    const strDateTo = processDate(filtro.dateTo);

    if (isNilOrEmpty(filtro.service)) {
      filtro.service = '';
    }
    if (isNilOrEmpty(filtro.status)) {
      filtro.status = '';
    }
    if (isNilOrEmpty(filtro.dateForFilter)) {
      filtro.dateForFilter = '';
    }

    const params = {
      PageNumber: filtro.pageNumber,
      ColumnName: filtro.columnName,
      InputSearch: filtro.inputSearch,
      Asc: filtro.asc.toString(),
      Service: filtro.service,
      Status: filtro.status,
      DateForFilter: filtro.dateForFilter,
      DateFrom: strDateFrom,
      DateTo: strDateTo,
    };

    const url = `${this.URI_API}/debt`;
    return this.http
      .get<DebtsPagedList>(url, { params })
      .pipe<DebtsPagedList>(
        map((response: DebtsPagedList) => {
          if (selectedUniverse) {
            this.itemsForDelete = [];
          }
          response.data.forEach((item) => {
            item.emissionDate = new Date(item.emissionDate);
            if (item.dueDate !== null && item.dueDate !== undefined) {
              item.dueDate = new Date(item.dueDate);
            }
            item.editInput = false;
            item.editButton = false;
            item.newStatus = '1';
            item.errores = {};
            item.selected = this.mustBeSelected(item, selectedUniverse);

            if (selectedUniverse && item.selected) {
              this.itemsForDelete.push(item.id);
            }
          });
          const data = response.data.map((item: Debts) => {
            return {
              ...item,
              emissionDate: isNil(item.emissionDate)
                ? ''
                : new Date(item.emissionDate),
              dueDate: isNil(item.dueDate) ? '' : new Date(item.dueDate),
              canEditFirstName: true,
              canEditEmissionDate: !isNil(item.emissionDate),
              canEditDueDate: !isNil(item.dueDate),
              canEditAmount: item.amount > 0,
            };
          });
          this.debtItems = { ...response, data };
          this.debtItemsOriginal = clone(this.debtItems);
          return response;
        })
      )
      .pipe(
        map((response) => {
          if (response.count == 0) {
            this.pageMessage = 'Mostrando 0 de 0 elementos';
          } else {
            const beg = (filtro.pageNumber - 1) * 50 + 1;
            let end = filtro.pageNumber * 50;
            if (end > response.count) {
              end = response.count;
            }
            this.pageMessage = `Mostrando ${beg} - ${end} de ${response.count} elementos`;
          }
          return response;
        })
      )
      .pipe(catchError((error) => throwError(error)));
  }

  deleteDeuda(idDebt: number): Observable<Debts> {
    // cambia link
    const url = `${this.URI_API}/debt/${idDebt}`;
    return this.http
      .post<Debts>(url, null)
      .pipe(catchError((error) => throwError(error)));
  }

  deleteAll(): Observable<any> {
    const url = `${this.URI_API}/debt/deleteAll`;
    return this.http
      .post<Debts>(url, { ids: this.itemsForDelete })
      .pipe(catchError((error) => throwError(error)));
  }

  deleteFiltered(filtro: DebstFilter = null) {
    if (filtro === null) {
      filtro = this.lastFilter;
    }
    const strDateFrom = isNilOrEmpty(filtro.dateFrom)
      ? ''
      : encodeURI(moment(filtro.dateFrom).format('YYYY/MM/DD'));
    const strDateTo = isNilOrEmpty(filtro.dateTo)
      ? ''
      : encodeURI(moment(filtro.dateTo).format('YYYY/MM/DD'));

    if (isNilOrEmpty(filtro.service)) {
      filtro.service = '';
    }
    if (isNilOrEmpty(filtro.status)) {
      filtro.status = '';
    }
    if (isNilOrEmpty(filtro.dateForFilter)) {
      filtro.dateForFilter = '';
    }

    const url = `${this.URI_API}/debt/deleteFiltered?InputSearch=${filtro.inputSearch}&Service=${filtro.service}&Status=${filtro.status}&DateForFilter=${filtro.dateForFilter}&DateFrom=${strDateFrom}&DateTo=${strDateTo}`;
    return this.http
      .post<Debts>(url, {})
      .pipe(catchError((error) => throwError(error)));
  }

  // ESITAR LA DEUDA
  editDeuda(id: number, debts: DebtEdit): Observable<any> {
    // cambia link
    const url = `${this.URI_API}/debt/put/${id}`;
    return this.http
      .post(url, debts)
      .pipe(catchError((error) => throwError(error)));
  }

  report({
    asc,
    columnName,
    dateForFilter,
    dateFrom,
    dateTo,
    inputSearch,
    pageNumber,
    service,
    status,
  }: DebstFilter): Observable<any> {
    const url = `${this.URI_API}/debt/report`;
    const parseDate: (date: Date | string) => Date | string = (date) =>
      isNilOrEmpty(date) ? '' : moment(date).format('YYYY/MM/DD');

    const filterRequest: DebstFilter = {
      pageNumber,
      columnName,
      asc,
      inputSearch,
      service,
      status,
      dateForFilter,
      dateFrom: parseDate(dateFrom),
      dateTo: parseDate(dateTo),
    };
    return this.http
      .post(url, filterRequest, {
        responseType: 'blob',
      })
      .pipe(catchError((err) => throwError(err)));
  }

  updateDeuda(id: number, paid: boolean): Observable<any> {
    const url = `${this.URI_API}/debt/pay`;
    const data = {
      idDebt: id,
      Payed: paid,
    };
    return this.http
      .post<any>(url, data)
      .pipe(catchError((error) => throwError(error)));
  }

  getPayments(debtId: number): Observable<any[]> {
    const url = `${this.URI_API}/payment/ofDebt/${debtId}`;
    return this.http
      .post<any[]>(url, null)
      .pipe(
        map((p) => {
          p.forEach((v) => {
            v.editing = false;
            v.errores = {};
          });
          return p;
        })
      )
      .pipe(catchError((err) => throwError(err)));
  }

  addPayment(debtId: number, payment: any): Observable<any> {
    const url = `${this.URI_API}/payment`;
    payment.debtId = debtId;
    return this.http
      .post<any>(url, payment)
      .pipe(catchError((err) => throwError(err)));
  }

  editPayment(
    debtId: number,
    paymentId: number,
    payment: any
  ): Observable<any> {
    const url = `${this.URI_API}/payment/${paymentId}`;
    payment.debtId = debtId;
    return this.http
      .post(url, payment)
      .pipe(catchError((err) => throwError(err)));
  }

  deletePayment(debtId: number, paymentId: number): Observable<any> {
    const url = `${this.URI_API}/payment/${paymentId}/ofDebt/${debtId}`;
    return this.http.post(url, null).pipe(catchError((err) => throwError(err)));
  }

  deleteDebt(id: number, forDelete: boolean) {
    const index = this.itemsForDelete.indexOf(id);
    if (forDelete) {
      if (index < 0) {
        this.itemsForDelete.push(id);
      }
    } else {
      if (index >= 0) {
        this.itemsForDelete.splice(index, 1);
      }
    }
  }

  clearMarksForDeletes() {
    this.itemsForDelete = [];
  }

  countMarksForDelete() {
    return this.itemsForDelete.length;
  }

  isMarkedAll(selectedUniverse: boolean = false) {
    let markAll = true;
    let mustBeChecked = false;
    this.debtItems.data.forEach((v) => {
      if (selectedUniverse) {
        if (this.mustBeSelected(v, selectedUniverse)) {
          markAll = markAll && v.selected;
          mustBeChecked = true;
        }
      } else {
        if (!v.hasIBKPayments && v.status !== 'PAGADO') {
          const idx = this.itemsForDelete.indexOf(v.id);
          markAll = markAll && idx >= 0;
          mustBeChecked = true;
        }
      }
    });
    return markAll && mustBeChecked;
  }

  resetDebts() {
    this.debtItems = clone(this.debtItemsOriginal);
  }
}
