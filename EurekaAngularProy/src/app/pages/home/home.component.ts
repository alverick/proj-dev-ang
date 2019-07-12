import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/shared/services/login.service';
import { User } from "src/app/shared/models/user.model";
import { StorageService } from 'src/app/shared/services/storage.service';
import { HomeService } from 'src/app/shared/services/home.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Debts } from 'src/app/shared/models/debts';
import { ExcelService } from 'src/app/shared/services/excel.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    
  public user: User;
  private unsubscribe$ = new Subject();
  private unsubscribe2$ = new Subject();

  DebtsList : Debts[];

  typeSelected: String;
  type: String[];

  wayPaySelected:  String;
  wayPay: String[];

  dateSelected: String;
  date: String[];

  serviceSelected: String;
  services: String[];

  /*Data Parcial */
  dataParcial: any = [{
    eid: 'e101',
    ename: 'ravi',
    esal: 1000
  },
  {
    eid: 'e102',
    ename: 'ram',
    esal: 2000
  },
  {
    eid: 'e103',
    ename: 'rajesh',
    esal: 3000
  }];

 /*Data Completa */
  dataCompleta: any = [{
    eid: 'e101',
    ename: 'ravi',
    eapellido: 'ravi',
    eemail: 'email',
    estado: 'deudor',
    fecha: '16/05/15',
    esal: 1000,
  },
  {
    eid: 'e102',
    ename: 'ram',
    eapellido: 'ravi',
    eemail: 'email',
    estado: 'deudor',
    fecha: '16/05/15',
    esal: 2000
  },
  {
    eid: 'e103',
    ename: 'rajesh',
    eapellido: 'ravi',
    eemail: 'email',
    estado: 'deudor',
    fecha: '16/05/15',
    esal: 3000
  },
  {
    eid: 'e104',
    ename: 'chris',
    eapellido: 'ravi',
    eemail: 'email',
    estado: 'deudor',
    fecha: '16/05/15',
    esal: 6000
  },
  {
    eid: 'e105',
    ename: 'jhon',
    eapellido: 'ravi',
    eemail: 'email',
    estado: 'deudor',
    fecha: '16/05/15',
    esal: 15000
  }];

  /* Data completa */

  constructor(
    private storageService: StorageService,
    private loginService: LoginService,
    private homeService: HomeService,
    private router: Router ,
    private excelService: ExcelService) { }


  ngOnInit() {

    this.user = this.storageService.getCurrentUser();

    this.homeService.getServices().pipe(takeUntil(this.unsubscribe$)).subscribe(
      value =>{
        this.services = value;
        this.serviceSelected = value[0];
        console.log("Servicios seleccionado : " + this.serviceSelected)
        console.log("Servicios : " + this.services)

      }
    );

    this.homeService.getDebts().pipe(takeUntil(this.unsubscribe2$)).subscribe(
      value => {
        this.DebtsList = value;
        // this.dateSelected = value[0];
      }
    );
 

  }

  consult(){
    this.router.navigateByUrl("['/subirPlantilla']");
  }

  exportDataParcialXLSX():void {
    this.excelService.exportAsExcelFile(this.dataParcial, 'data_parcial');
  }

  exportDataCompletaXLSX():void{
    this.excelService.exportAsExcelFile(this.dataCompleta, 'data_completa');
  }
  

  

 

  

}
