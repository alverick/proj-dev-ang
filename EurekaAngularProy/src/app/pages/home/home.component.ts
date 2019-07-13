import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/shared/services/login.service';
import { User } from "src/app/shared/models/user.model";
import { StorageService } from 'src/app/shared/services/storage.service';
import { HomeService } from 'src/app/shared/services/home.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { Debts } from 'src/app/shared/models/debts';
import { WayPay } from 'src/app/shared/models/way-pay';
import { Type } from 'src/app/shared/models/type';
import { Date } from 'src/app/shared/models/date';


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
    this.user = this.storageService.getCurrentUser();

    this.homeService.getServices().pipe(takeUntil(this.unsubscribe$)).subscribe(
      value =>{
        this.services = value;
        this.serviceSelected = value[0];
        console.log("Servicios seleccionado : " + this.serviceSelected)
        console.log("Servicios : " + this.services)
      });

    this.homeService.getDebts().pipe(takeUntil(this.unsubscribe2$)).subscribe(
      value => {
        this.DebtsList = value; 
      }
    );


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
  }

  consult(){
    this.router.navigateByUrl("['/subirPlantilla']");
  }

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


  

 

  

}
