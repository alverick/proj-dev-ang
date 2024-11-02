import { Component, ElementRef, type OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  type FormControl,
  type FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { type QueryParams } from '@ngrx/data';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { clone, flatten, pipe, pluck, uniq, values } from 'ramda';
import { isNotNilOrEmpty } from 'ramda-adjunct';
import { combineLatest } from 'rxjs';
import { filter } from 'rxjs/operators';

import { currencies } from '../../../../shared/constants/currencies';
import { CollectAmountService } from '../../../../store/collections/collect-amount.service';
import { HistoricalCollectService } from '../../../../store/collections/historical-collect.service';
import { TopClientService } from '../../../../store/collections/top-client.service';
import { type CollectAmount, type TopClient } from '../../../../store/entities';
import { type GraphData } from '../../components/dashboard-graph/dashboard-graph.component';
import { internalFullRoutingNames } from '../../internal-routing.names';
import { DashboardService } from '../../services';

const dateFormat: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
};

export interface FilterParams {
  service: number[];
  dateType: string;
  startDate: string;
  endDate: string;
}

interface EmailForm {
  email: FormControl<string>;
  subject: FormControl<string>;
}

@Component({
  selector: 'cs-dashboard',
  templateUrl: './dashboard.page.html',
})
export class DashboardPage implements OnInit {
  optionsDates = [
    { name: 'Pago', code: 'PaymentDate' },
    { name: 'Emisión', code: 'EmissionDate' },
    { name: 'Vencimiento', code: 'DueDate' },
  ];
  dateTo = new Date();
  dateFrom = new Date();
  initialValue;
  filter: any;
  services: any;
  collectAmounts: CollectAmount;
  clients: TopClient[] = [];
  graphData: GraphData;
  currencyCode = '001';
  currencyLabel = 'S/';
  showModal = false;
  loadingAmounts = true;
  loadingTable = false;
  loadingChart = false;
  emailForm: FormGroup<EmailForm>;
  @ViewChild('outputHtml', { static: false }) outputHtml: ElementRef;

  constructor(
    private dashboard: DashboardService,
    private router: Router,
    protected fb: FormBuilder,
    private collectAmountService: CollectAmountService,
    private historicalCollectService: HistoricalCollectService,
    private topClientService: TopClientService,
  ) {
    this.dateFrom.setMonth(this.dateFrom.getMonth() - 1);
    this.setCollectAmount();
    this.setTopClient();
    this.setHistoricalCollect();
  }

  ngOnInit() {
    this.emailForm = this.fb.group({
      email: this.fb?.nonNullable?.control('', Validators.required),
      subject: this.fb?.control(''),
    });
    this.loadingTable = true;
    this.loadingChart = true;
    this.dashboard
      ?.getServices()
      ?.pipe(filter((value) => isNotNilOrEmpty(value)))
      .subscribe((value) => {
        const servicesList = value.map(({ currency, id, name, dataType }) => ({
          id,
          name,
          currency,
          dataType,
        }));
        const currenciesServices = pipe(pluck('currency'), uniq)(value);
        const servicesFiltered =
          currenciesServices.length > 1
            ? servicesList.filter(
                (item) => item.currency === currencies[0].code,
              )
            : servicesList;
        this.services = servicesList;
        const servicesListId = servicesFiltered.map(({ id }) => id);
        this.initialValue = {
          payment: this.optionsDates[0],
          dateTo: this.dateTo,
          dateFrom: this.dateFrom,
          services: servicesFiltered,
        };
        this.filter = clone(this.initialValue);
        this.query({
          service: servicesListId,
          dateType: 'PaymentDate',
          startDate: this.dateFrom.toLocaleDateString('zh-TW', dateFormat),
          endDate: this.dateTo.toLocaleDateString('zh-TW', dateFormat),
        });
      });
  }

  private setCollectAmount() {
    this.collectAmountService?.collection$?.subscribe((value) => {
      this.collectAmounts = value.entities[1];
    });
    combineLatest([
      this.collectAmountService.loaded$,
      this.collectAmountService.loading$,
    ]).subscribe(([loaded, loading]) => {
      if (loaded) {
        this.loadingAmounts = loading;
      }
    });
  }

  private setHistoricalCollect() {
    this.historicalCollectService?.collection$?.subscribe((value) => {
      const dataList = values(value.entities);
      const dates: string[] = pipe(
        pluck('date'),
        flatten,
        uniq,
      )(dataList) as string[];

      dates.sort((dateA, dateB): number => {
        const makeDate = (dateVal: string) => {
          const dateParts = dateVal.split('/');
          const date = new Date(
            parseInt(dateParts[2]),
            parseInt(dateParts[1]) - 1,
            parseInt(dateParts[0]),
          );
          return date;
        };
        return makeDate(dateA) > makeDate(dateB) ? 1 : -1;
      });

      const datasets = dataList.map(({ amountCollected, service, date }) => {
        const amounts = dates.map((item) => {
          const position = date.indexOf(item);
          return position >= 0 ? amountCollected[position] : 0;
        });
        return {
          label: service,
          data: amounts,
        };
      });
      this.graphData = {
        labels: dates,
        datasets,
      };
    });
    combineLatest([
      this.historicalCollectService.loaded$,
      this.historicalCollectService.loading$,
    ]).subscribe(([loaded, loading]) => {
      if (loaded) {
        this.loadingChart = loading;
      }
    });
  }

  private setTopClient() {
    this.topClientService?.collection$?.subscribe((value) => {
      this.clients = values(value.entities);
    });
    combineLatest([
      this.topClientService.loaded$,
      this.topClientService.loading$,
    ]).subscribe(([loaded, loading]) => {
      if (loaded) {
        this.loadingTable = loading;
      }
    });
  }

  sendFilters(value: any) {
    this.filter = value;
    this.query({
      service: value.services.map(({ id }) => id),
      dateType: value.payment.code,
      startDate: value.dateFrom.toLocaleDateString('zh-TW', dateFormat),
      endDate: value.dateTo.toLocaleDateString('zh-TW', dateFormat),
    });
  }

  sendEmail() {
    this.showModal = true;
  }

  sendEmailForm() {
    const output: HTMLElement = document.querySelector('.output-mail');
    output.style.visibility = 'visible';
    const formData = new FormData();
    formData.append('to', this.emailForm.value.email);
    formData.append('subject', this.emailForm.value.subject);
    void html2canvas(output).then((canvas) => {
      output.style.visibility = 'hidden';
      const doc = new jsPDF();
      const width = 120;
      const paper = 210;
      const imgData = canvas.toDataURL('image/png');
      doc.addImage(
        imgData,
        'PNG',
        (paper - width) / 2,
        5,
        width,
        (output.offsetHeight * width) / output.offsetWidth,
        '',
        'FAST',
      );
      const report = doc.output('blob');
      formData.append('filename', report);
      this.dashboard.sendEmail(formData).subscribe({
        next: (value) => {
          console.log('sendEmail', value);
          this.emailForm.reset();
          this.showModal = false;
        },
        error: (error) => {
          console.log('error', error);
          this.emailForm.reset();
          this.showModal = false;
        },
      });
    });
  }

  query(filterData: QueryParams) {
    this.collectAmountService.clearCache();
    this.collectAmountService.getWithQuery(filterData);
    this.topClientService.clearCache();
    this.topClientService.getWithQuery(filterData);
    this.historicalCollectService.clearCache();
    this.historicalCollectService.getWithQuery(filterData);
  }

  goto(typePayment: string[], useStatus = false) {
    const statusOptions = {
      PaymentDate: ['PENDIENTE', 'VENCIDO', 'PARCIAL'],
      EmissionDate: ['PENDIENTE', 'VENCIDO', 'PARCIAL'],
      DueDate: ['VENCIDO'],
    };

    const services =
      this.filter.services.length === this.services.length
        ? []
        : this.filter.services;
    void this.router.navigate([internalFullRoutingNames.HOME], {
      state: {
        filter: {
          ...this.filter,
          services,
          status: useStatus
            ? statusOptions[this.filter.payment.code]
            : typePayment,
        },
      },
    });
  }

  currencyChanged($event: string) {
    this.currencyCode = $event;
    this.currencyLabel = currencies.find((item) => item.code === $event).symbol;
  }
}
