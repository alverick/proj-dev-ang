import { Component, Input } from '@angular/core';

export interface Dataset {
  data: number[];
  label: string;
}

export interface GraphData {
  datasets: Dataset[];
  labels: string[];
}

@Component({
  selector: 'cs-dashboard-graph',
  templateUrl: './dashboard-graph.component.html',
  styleUrls: ['./dashboard-graph.component.scss'],
})
export class DashboardGraphComponent {
  @Input() serviceData: GraphData;
  @Input() printMode = false;
  @Input() loading = false;
  height = '500';
  constructor() {
    this.height = window.innerWidth > 768 ? '500' : '300';
  }
}
