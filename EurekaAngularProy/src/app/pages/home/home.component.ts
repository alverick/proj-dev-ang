import { Component, OnInit, Inject } from '@angular/core';
import { LoginService } from 'src/app/shared/services/login.service';
import { User } from "src/app/shared/models/user.model";
import { StorageService } from 'src/app/shared/services/storage.service';
import { HomeService } from 'src/app/shared/services/home.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Debts } from 'src/app/shared/models/debts';
<<<<<<< HEAD
import { ExcelService } from 'src/app/shared/services/excel.service';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material';

export interface DialogData {
  animal: 'panda' | 'unicorn' | 'lion';
}
=======
import { WayPay } from 'src/app/shared/models/way-pay';
import { Type } from 'src/app/shared/models/type';
import { Date } from 'src/app/shared/models/date';

>>>>>>> 5d00352977cc67c8a861be1989cebf698f5da703

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html', 
  styleUrls: ['./home.component.scss']
})


export class HomeComponent implements OnInit {
    
  DebtsArray = [];
  public user: User;
  checkboxes: any;
  private unsubscribe$ = new Subject();
  private unsubscribe2$ = new Subject();
<<<<<<< HEAD


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
  dataParcial: any = [{  eid: 'e101',    ename: 'ravi',    esal: 1000},  { eid: 'e102',  ename: 'ram',    esal: 2000  },  { eid: 'e103',   ename: 'rajesh',    esal: 300}];

 /*Data Completa */
  dataCompleta: any = [{ eid: 'e101',    ename: 'ravi',   eapellido: 'ravi',   eemail: 'email',   estado: 'deudor', fecha: '16/05/15',   esal: 1000, }, {   eid: 'e102',   ename: 'ram',   eapellido: 'ravi',    eemail: 'email',    estado: 'deudor',  fecha: '16/05/15', esal: 2000},  {eid: 'e103',  ename: 'rajesh',   eapellido: 'ravi',   eemail: 'email',   estado: 'deudor',   fecha: '16/05/15', esal: 3000},
  {  eid: 'e104',  ename: 'chris',  eapellido: 'ravi',  eemail: 'email', estado: 'deudor', fecha: '16/05/15',  esal: 6000 },
  {  eid: 'e105', ename: 'jhon', eapellido: 'ravi',   eemail: 'email', estado: 'deudor',   fecha: '16/05/15',  esal: 15000}];

  /* Data completa */

  constructor(
    private storageService: StorageService,
    private homeService: HomeService,
    private router: Router ,
    private excelService: ExcelService,
    public dialog: MatDialog) { }
/*
  openDialog(){
    this.dialog.open(DialogDataExampleDialog, {
      data: {
        animal: 'panda'
      }
    });
  }
*/

openDialog() {
  const dialogRef = this.dialog.open(DialogDataExampleDialog);

  dialogRef.afterClosed().subscribe(result => {
    console.log(`Dialog result: ${result}`);
  });
}

  ngOnInit() {
=======
  private unsubscribe3$ = new Subject();
  private unsubscribe4$ = new Subject();
  private unsubscribe5$ = new Subject();

  DebtsList : Debts[]; 
  typeList: Type[];
  waypayList: WayPay[];
  DateList: Date[]; 
  serviceSelected: String;
  services: String[];  
  mostrar: Boolean;
  BotonEditar: Boolean;
  BotonCancelar: Boolean;
  inputEdit: Boolean;
  InputList: Boolean;
  constructor(
    private storageService: StorageService,
    private loginService: LoginService,
 
    private homeService: HomeService,
    private router: Router  ) { }
 
  ngOnInit() {
    this.InputList = true;
    this.mostrar= true; 
>>>>>>> 5d00352977cc67c8a861be1989cebf698f5da703
    this.user = this.storageService.getCurrentUser();
    this.homeService.getServices().pipe(takeUntil(this.unsubscribe$)).subscribe(
      value =>{
        this.services = value;
        this.serviceSelected = value[0];
        console.log("Servicios seleccionado : " + this.serviceSelected)
        console.log("Servicios : " + this.services)
<<<<<<< HEAD
      }
    );
=======
      });
>>>>>>> 5d00352977cc67c8a861be1989cebf698f5da703

    this.homeService.getDebts().pipe(takeUntil(this.unsubscribe2$)).subscribe(
      value => {
        this.DebtsList = value; 
      }
    );
<<<<<<< HEAD
=======


    this.homeService.getType().pipe(takeUntil(this.unsubscribe3$)).subscribe(
      value => {
        this.typeList = value; 
    }); 
    this.homeService.getWayPay().pipe(takeUntil(this.unsubscribe4$)).subscribe(
      value => {
        this.waypayList = value; 
    }); 
    this.homeService.getDate().pipe(takeUntil(this.unsubscribe5$)).subscribe(
      value => {
        this.DateList = value; 
    });  
>>>>>>> 5d00352977cc67c8a861be1989cebf698f5da703
  }

  

  consult(){
    this.router.navigateByUrl("['/subirPlantilla']");
  }

<<<<<<< HEAD
  exportDataParcialXLSX():void {
    this.excelService.exportAsExcelFile(this.dataParcial, 'data_parcial');
  }

  exportDataCompletaXLSX():void{
    this.excelService.exportAsExcelFile(this.dataCompleta, 'data_completa');
  }
=======
  BotonActualizar(id: number){
    this.mostrar  = false;
    this.BotonEditar = true;
    this.BotonCancelar = true;
    this.inputEdit = true;
    this.InputList = false;
   // alert(id); 
  }

  BotonCancela(){
    this.mostrar  = true; 
    this.BotonEditar = false;
    this.BotonCancelar = false;
    
    this.inputEdit = false;
    this.InputList = true;
  }


  SeleccionarParaEliminar(idDebt: number){
  
    //alert(idDebt);
     this.DebtsArray.push(idDebt);
  /*
    if (this.DebtsArray.length === 0) {
      this.DebtsArray.push(idDebt); 
    } else{
      for (const value in this.DebtsArray) { 
        if(this.DebtsArray[value] === idDebt){
          this.DebtsList.splice(this.DebtsArray[value],1)
          alert(idDebt + ' ya esta agregado y se elimino');
        }
        else{
          this.DebtsArray.push(idDebt);
          alert(idDebt + ' agregado');
        }
    }
    }  
*/

     
  }

  EliminarSeleccionados(){
    alert(this.DebtsArray);
     
     if (this.DebtsArray.length > 0) { 
      for (const value in this.DebtsArray) { 
        this.DebtsList.splice(this.DebtsArray[value],1);
 
      } 
      alert('eliminados');
      this.DebtsArray  = []; 
   } else {
       alert('seleccione algun elemento para eliminar');
   }
 

   
     
  }

  SeleccionarTodos() {
   /* this.checkboxes  = document.getElementsByTagName('input')
    
    alert(this.checkboxes);
     
     for (const valinput in this.checkboxes){
       
          if(this.checkboxes[valinput].type === "checkbox"){
            this.cont++;
          } 
     } 
     alert(this.cont.toString());
    */ 
  }


>>>>>>> 5d00352977cc67c8a861be1989cebf698f5da703
  

}


@Component({
  selector: 'dialog-data-example-dialog',
  templateUrl: 'dialog-data-example-dialog.html',
})

export class DialogDataExampleDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {}
}

