import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import * as _moment from 'moment';
import { default as _rollupMoment } from 'moment';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';


const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-datepicker2',
  templateUrl: './datepicker2.component.html',
  styleUrls: ['./datepicker2.component.scss'],
  providers: [

    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})

export class Datepicker2Component implements OnInit {

  @Output() date2: EventEmitter<any> = new EventEmitter<any>(); 
  date = new FormControl(moment());

  constructor() { }

  ngOnInit() {
  }
 
  change(dateEvent) {
    this.date2.emit(dateEvent.value)
  }

}
