import { DatePipe } from '@angular/common';
import { HttpClient, type HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { clone, isNil } from 'ramda';
import { isNilOrEmpty } from 'ramda-adjunct';
import { type Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { type Debts, type DebtsPagedList } from '../models/debts';
import { type DebtEdit } from '../models/debts-edit.model';
import { type DebstFilter } from '../models/debts-filter.model';

@Injectable()
export class TransactionService {
  private readonly URI_API: string = environment.END_POINT;
  private lastFilter: DebstFilter = null;
  datePipe = inject(DatePipe);

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

  private mustBeSelected(d: Debts, selectedUniverse = false): boolean {
    return (
      !d.hasIBKPayments &&
      d.status !== 'PAGADO' &&
      (selectedUniverse || this.itemsForDelete.includes(d.id))
    );
  }

  getDeuda(
    filtro: DebstFilter = null,
    selectedUniverse: boolean = false,
  ): Observable<any> {
    if (filtro === null) {
      filtro = this.lastFilter;
    } else {
      this.lastFilter = filtro;
    }
    const processDate = (value: string | Date) => {
      return isNilOrEmpty(value)
        ? ''
        : encodeURI(this.datePipe.transform(value, 'dd/MM/yyyy'));
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
        }),
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
        }),
      )
      .pipe(catchError((err: HttpErrorResponse) => throwError(() => err)));
  }

  editDeuda(id: number, debts: DebtEdit): Observable<any> {
    const url = `${this.URI_API}/debt/put/${id}`;
    return this.http
      .post(url, debts)
      .pipe(catchError((err: HttpErrorResponse) => throwError(() => err)));
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
      isNilOrEmpty(date) ? '' : this.datePipe.transform(date, 'dd/MM/yyyy');

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
      .pipe(catchError((err: HttpErrorResponse) => throwError(() => err)));
  }

  updateDeuda(id: number, paid: boolean): Observable<any> {
    const url = `${this.URI_API}/debt/pay`;
    const data = {
      idDebt: id,
      Payed: paid,
    };
    return this.http
      .post<any>(url, data)
      .pipe(catchError((err: HttpErrorResponse) => throwError(() => err)));
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
        }),
      )
      .pipe(catchError((err: HttpErrorResponse) => throwError(() => err)));
  }

  addPayment(debtId: number, payment: any): Observable<any> {
    const url = `${this.URI_API}/payment`;
    payment.debtId = debtId;
    return this.http
      .post<any>(url, payment)
      .pipe(catchError((err: HttpErrorResponse) => throwError(() => err)));
  }

  editPayment(
    debtId: number,
    paymentId: number,
    payment: any,
  ): Observable<any> {
    const url = `${this.URI_API}/payment/${paymentId}`;
    payment.debtId = debtId;
    return this.http
      .post(url, payment)
      .pipe(catchError((err: HttpErrorResponse) => throwError(() => err)));
  }

  deletePayment(debtId: number, paymentId: number): Observable<any> {
    const url = `${this.URI_API}/payment/${paymentId}/ofDebt/${debtId}`;
    return this.http
      .post(url, null)
      .pipe(catchError((err: HttpErrorResponse) => throwError(() => err)));
  }

  clearMarksForDeletes() {
    this.itemsForDelete = [];
  }

  isMarkedAll(selectedUniverse: boolean = false) {
    const itemsToCheck = selectedUniverse
      ? this.debtItems.data.filter((v) =>
          this.mustBeSelected(v, selectedUniverse),
        )
      : this.debtItems.data.filter(
          (v) => !v.hasIBKPayments && v.status !== 'PAGADO',
        );

    if (itemsToCheck.length === 0) {
      return false;
    }

    for (const v of itemsToCheck) {
      const isSelected = selectedUniverse
        ? v.selected
        : this.itemsForDelete.includes(v.id);
      if (!isSelected) {
        return false;
      }
    }

    return true;
  }

  resetDebts() {
    this.debtItems = clone(this.debtItemsOriginal);
  }
}
