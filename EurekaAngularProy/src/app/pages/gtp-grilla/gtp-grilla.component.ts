import { GtpService } from './../../shared/services/gtp.service';
import { StatesGtp } from './../../shared/models/states-gtp';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AfiliacionService } from 'src/app/shared/services/afiliacion.service';
import { RubroModel } from 'src/app/shared/models';
import { GtpFilter } from 'src/app/shared/models/gtp-filter';

@Component({
  selector: 'app-gtp-grilla',
  templateUrl: './gtp-grilla.component.html',
  styleUrls: ['./gtp-grilla.component.scss']
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

