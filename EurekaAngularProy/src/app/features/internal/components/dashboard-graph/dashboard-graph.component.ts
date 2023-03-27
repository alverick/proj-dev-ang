import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { path } from 'ramda';
import { isNotNil } from 'ramda-adjunct';

export interface Dataset {
  data: number[];
  label: string;
  backgroundColor: string;
}

export interface GraphData {
  datasets: Partial<Dataset>[];
  labels: string[];
}

const colorsInt = [
  [
    '--primary-green-1',
    '--primary-green-2',
    '--primary-green-3',
    '--primary-green-4',
    '--primary-green-5',
  ],
  [
    '--secondary-blue-1',
    '--secondary-blue-2',
    '--secondary-blue-3',
    '--secondary-blue-4',
    '--secondary-blue-5',
  ],
  [
    '--extended-palette-darkblue-1',
    '--extended-palette-darkblue-2',
    '--extended-palette-darkblue-3',
    '--extended-palette-darkblue-4',
    '--extended-palette-darkblue-5',
  ],
  [
    '--extended-palette-lightblue-1',
    '--extended-palette-lightblue-2',
    '--extended-palette-lightblue-3',
    '--extended-palette-lightblue-4',
    '--extended-palette-lightblue-5',
  ],
  [
    '--extended-palette-watermelon-1',
    '--extended-palette-watermelon-2',
    '--extended-palette-watermelon-3',
    '--extended-palette-watermelon-4',
    '--extended-palette-watermelon-5',
  ],
  [
    '--extended-palette-yellow-1',
    '--extended-palette-yellow-2',
    '--extended-palette-yellow-3',
    '--extended-palette-yellow-4',
  ],
];

@Component({
  selector: 'cs-dashboard-graph',
  templateUrl: './dashboard-graph.component.html',
  styleUrls: ['./dashboard-graph.component.scss'],
})
export class DashboardGraphComponent implements OnChanges {
  @Input() serviceData: GraphData;
  @Input() printMode = false;
  @Input() loading = false;
  internalData: GraphData;
  height = '500';

  constructor() {
    this.height = window.innerWidth > 768 ? '500' : '300';
    console.log('constructor', this.serviceData);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('ngOnInit', this.serviceData);
    if (isNotNil(path(['serviceData', 'currentValue'], changes))) {
      this.parseColors();
    }
  }

  parseColors() {
    const colors: string[] = [];
    const limit = 5;
    for (let i = 0; i < limit; i++) {
      colorsInt.forEach((list) => {
        if (list[i]) colors.push(list[i]);
      });
    }
    const documentStyle = getComputedStyle(document.documentElement);
    const datasets = this.serviceData.datasets.map((item, index) => {
      const pos = index % colors.length;
      return {
        ...item,
        backgroundColor: documentStyle.getPropertyValue(colors[pos]),
      };
    });
    this.internalData = { ...this.serviceData, datasets };
  }
}
