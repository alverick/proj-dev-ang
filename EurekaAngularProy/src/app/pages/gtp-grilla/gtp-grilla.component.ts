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
import { EnterprisesGtp, EnterprisesPagedList } from 'src/app/shared/models/enterprises-gtp';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
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
  
  minDate = new Date(2000, 0, 1);
  maxDate = new Date(2050, 0, 1);
  @ViewChild('inputDate1', { static: true }) inputDate1: ElementRef;
  @ViewChild('inputDate2', { static: true }) inputDate2: ElementRef;
  messageTable: string ='';
  showArrow: boolean = false;

  currentFiltro: GtpFilter = {
    pageNumber: 1,
    ColumnName: '',
    asc: true,
    inputSearch: '', 
    BusinessHeading:'',
    status: '',  
    dateFrom: null,
    dateTo: null
  };
  filtro: GtpFilter = {
    pageNumber: 1,
    ColumnName: '',
    asc: true,
    inputSearch: '', 
    BusinessHeading:'',
    status: '',  
    dateFrom: null,
    dateTo: null
  };
  errores: any = {};
  

// gtpServiceEmpresas  
  constructor(private spinner: NgxSpinnerService,private afiliacionService: AfiliacionService, private gtpService: GtpService,private router: Router) { }
  rubros: RubroModel[] = [];
  states: StatesGtp[] =[];
 
 
  ngOnInit() { 
    this.afiliacionService.GetRubros().subscribe(d => this.rubros = d);
    this.gtpService.getStates().subscribe(d => this.states = d); 
    this.consultaGtp();
    console.log('imprime las solicitudes');
    console.log( this.gtpService.EnterprisesItems.listCompanyGTP); 
  }
  limpiardate1() {
    this.inputDate1.nativeElement.value = '';
    this.filtro.dateFrom = null; 
  }
  limpiardate2() {
    this.inputDate2.nativeElement.value = '';
    this.filtro.dateTo = null; 
  } 
  Aprobar( ClientId: number){ 
   location.href = '/AprobacionGtp/'+ClientId; 
  }

  
  sendFiltro() {
    this.currentFiltro.inputSearch = this.filtro.inputSearch;
    this.currentFiltro.BusinessHeading = this.filtro.BusinessHeading;
    this.currentFiltro.status = this.filtro.status; 
    this.currentFiltro.dateFrom = this.filtro.dateFrom;
    this.currentFiltro.dateTo = this.filtro.dateTo;

    this.consultaGtp();

    if((this.filtro.inputSearch === '' || this.filtro.inputSearch === null || this.filtro.inputSearch === undefined) && 
    (this.filtro.BusinessHeading === '' || this.filtro.BusinessHeading === null || this.filtro.BusinessHeading === undefined) &&
    (this.filtro.status == '' || this.filtro.status === null || this.filtro.status === undefined)  &&
    ( /*this.filtro.dateFrom == ''  ||*/ this.filtro.dateFrom === null || this.filtro.dateFrom === undefined)){
      this.messageTable = 'Para empezar, agrega la lista de las deudas';
       this.showArrow = true; 
    }else{
      this.messageTable ='No se encontro ningún registro para esta búsqueda';
      this.showArrow = false;
    }

  }

  // callback:  cuando se termine de ejecutar la consulta se ejecuta el callback
 // consultaDeuda(cb: () => void = null) {

 consultaGtp(){
    this.spinner.show(); 
    this.gtpService.getEmpresas(this.filtro).subscribe(d => {});
    this.spinner.hide();
  }
 /* 
   consultaGtp(){
    this.gtpService.getEnterprisesGtp().subscribe(d=> this.empresasftp = d);
  } 
 */
}

