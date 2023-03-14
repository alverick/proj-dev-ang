import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { clone, flatten, pipe, pluck, uniq } from 'ramda';
import { isNotNilOrEmpty } from 'ramda-adjunct';
import { filter } from 'rxjs/operators';

import {
  CollectAmounts,
  HistoricalData,
  TopClients,
} from '../../../../shared/data/dashboard-data.service';
import { GraphData } from '../../components/dashboard-graph/dashboard-graph.component';
import { internalFullRoutingNames } from '../../internal-routing.names';
import { DashboardService } from '../../services';
import { currencies } from '../../../../shared/constants/currencies';

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
  styleUrls: ['./dashboard.page.scss'],
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
  collectAmounts: CollectAmounts;
  clients: TopClients[] = [];
  graphData: GraphData;
  currencyCode = '001';
  currencyLabel = 'S/';
  showModal = false;
  loading = false;
  emailForm: FormGroup<EmailForm>;
  @ViewChild('outputHtml', { static: false }) outputHtml: ElementRef;

  constructor(
    private dashboard: DashboardService,
    private router: Router,
    protected fb: FormBuilder
  ) {
    this.dateFrom.setMonth(this.dateFrom.getMonth() - 1);
    console.log(this.dateFrom);
  }

  ngOnInit() {
    this.emailForm = this.fb.group({
      email: this.fb.nonNullable.control('', Validators.required),
      subject: this.fb.control(''),
    });
    this.loading = true;
    this.dashboard
      .getServices()
      .pipe(filter((value) => isNotNilOrEmpty(value)))
      .subscribe((value) => {
        const servicesList = value.map(({ currency, id, name, dataType }) => ({
          id,
          name,
          currency,
          dataType,
        }));
        const currencies = pipe(pluck('currency'), uniq)(value);
        const servicesFiltered =
          currencies.length > 1
            ? servicesList.filter((item) => item.currency === currencies[0])
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
    console.log('ngOnInit', this.services);
  }

  sendFilters(value: any) {
    console.log(value);
    this.filter = value;
    this.query({
      service: value.services.map(({ id }) => id),
      dateType: value.payment.code,
      startDate: value.dateFrom.toLocaleDateString('zh-TW', dateFormat),
      endDate: value.dateTo.toLocaleDateString('zh-TW', dateFormat),
    });
  }

  sendEmail() {
    console.log('sendEmail');
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
        'FAST'
      );
      const report = doc.output('blob');
      formData.append('filename', report);
      this.dashboard.sendEmail(formData).subscribe(
        (value) => {
          console.log('sendEmail', value);
          this.emailForm.reset();
          this.showModal = false;
        },
        (error) => {
          console.log('error', error);
          this.emailForm.reset();
          this.showModal = false;
        }
      );
    });
  }

  query(filterData: FilterParams) {
    this.dashboard.getCollect(filterData).subscribe((value) => {
      this.collectAmounts = value[0];
      this.loading = false;
    });
    this.dashboard.getClients(filterData).subscribe((value) => {
      this.clients = value.map((item) => {
        return { ...item, currency: this.currency };
      });
    });
    this.dashboard.getHistorical(filterData).subscribe((value) => {
      const dates: string[] = pipe(
        pluck('date'),
        flatten,
        uniq
      )(value) as string[];

      dates.sort((dateA, dateB): number => {
        const makeDate = (dateVal: string) => {
          const dateParts = dateVal.split('/');
          const date = new Date(
            parseInt(dateParts[2]),
            parseInt(dateParts[1]) - 1,
            parseInt(dateParts[0])
          );
          return date;
        };
        return makeDate(dateA) > makeDate(dateB) ? 1 : -1;
      });

      const datasets = value.map(({ amountCollected, service, date }) => {
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
  }

  goto(typePayment: string) {
    const services =
      this.filter.services.length === this.services.length
        ? []
        : this.filter.services;
    void this.router.navigate([internalFullRoutingNames.HOME], {
      state: { filter: { ...this.filter, services, status: typePayment } },
    });
  }

  currencyChanged($event: string) {
    this.currencyCode = $event;
    this.currencyLabel = currencies.find((item) => item.code === $event).symbol;
  }
}
