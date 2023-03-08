import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { jsPDF } from 'jspdf';
import { clone, pathOr } from 'ramda';
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
  filter;
  services: any;
  collectAmounts: CollectAmounts;
  clients: TopClients[] = [];
  graphData: GraphData;
  currency = 'S/';
  @ViewChild('outputHtml', { static: false }) outputHtml: ElementRef;

  constructor(private dashboard: DashboardService, private router: Router) {
    this.dateFrom.setMonth(this.dateFrom.getMonth() - 1);
    console.log(this.dateFrom);
  }

  ngOnInit() {
    this.dashboard
      .getServices()
      .pipe(filter((value) => isNotNilOrEmpty(value)))
      .subscribe((value) => {
        console.log('getServices', value);
        const servicesList = value.map(({ currency, id, name, dataType }) => ({
          id,
          name,
          currency,
          dataType,
        }));
        const servicesListId = value.map(({ id }) => id);
        this.services = servicesList;
        this.initialValue = {
          payment: this.optionsDates[0],
          dateTo: this.dateTo,
          dateFrom: this.dateFrom,
          services: servicesList,
        };
        console.log('initialValue', this.initialValue);
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

  query(filterData: FilterParams) {
    console.log('filterData', filterData);
    this.dashboard.getCollect(filterData).subscribe((value) => {
      console.log('getCollect', value);
      this.collectAmounts = value[0];
    });
    this.dashboard.getClients(filterData).subscribe((value) => {
      console.log('getClients', value);
      this.clients = value.map((item) => {
        return { ...item, currency: this.currency };
      });
    });
    this.dashboard.getHistorical(filterData).subscribe((value) => {
      const labels: string[] = pathOr([], [0, 'date'], value);
      const datasets = value.map(({ amountCollected, service }) => ({
        label: service,
        data: amountCollected,
      }));
      console.log('getHistorical', value, labels, datasets);
      this.graphData = {
        labels: labels.map((item) => item.replace(' 00:00:00', '')),
        datasets,
      };
    });
  }

  goto(typePayment: string) {
    void this.router.navigate([internalFullRoutingNames.HOME], {
      state: { filter: this.filter },
    });
  }
}
