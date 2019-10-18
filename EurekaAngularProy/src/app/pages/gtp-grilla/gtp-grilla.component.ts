import { GtpService } from './../../shared/services/gtp.service';
import { StatesGtp } from './../../shared/models/states-gtp';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AfiliacionService } from 'src/app/shared/services/afiliacion.service';
import { RubroModel } from 'src/app/shared/models';
import { GtpFilter } from 'src/app/shared/models/gtp-filter';

/// DATE PIECKER FORMAT
import * as _moment from 'moment';  // dejalo si sale error
import { default as _rollupMoment } from 'moment';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
//// END DATE ////////////////////

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
////////////////////////////


@Component({
  selector: 'app-gtp-grilla',
  templateUrl: './gtp-grilla.component.html',
  styleUrls: ['./gtp-grilla.component.scss'],
  providers: [

    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },

    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class GtpGrillaComponent implements OnInit {

  @ViewChild('inputDate1', { static: true }) inputDate1: ElementRef;
  @ViewChild('inputDate2', { static: true }) inputDate2: ElementRef;

  
  filtro: GtpFilter = {
    pageNumber: 1,
    columnName: '',
    asc: true,
    inputSearch: '', 
    entry:'',
    status: '',  
    dateFrom: null,
    dateTo: null
  };


  constructor(private afiliacionService: AfiliacionService, private gtpService: GtpService) { }
  rubros: RubroModel[] = [];
  states: StatesGtp[] =[];



  ngOnInit() { 
    this.afiliacionService.GetRubros().subscribe(d => this.rubros = d);
    this.gtpService.getStates().subscribe(d => this.states = d);
    console.log('Rubros');
    console.table(this.rubros);
  }



  



  limpiardate1() {
    this.inputDate1.nativeElement.value = '';
    this.filtro.dateFrom = null; 
  }
  limpiardate2() {
    this.inputDate2.nativeElement.value = '';
    this.filtro.dateTo = null; 
  }
 
}

