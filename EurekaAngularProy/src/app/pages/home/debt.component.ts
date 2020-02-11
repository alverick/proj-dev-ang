import { Component, OnInit } from "@angular/core";
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MatDialogRef } from "@angular/material";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { HomeService } from "src/app/shared/services/home.service";
import Swal from "sweetalert2";
import { drawPopup } from "src/app/shared/services/popups";
import { ExcelService } from "src/app/shared/services/excel.service";

const MY_FORMATS = {
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
  selector: 'app-debt-form',
  templateUrl: './debt.component.html',
  styleUrls: ['./debt.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})


// tslint:disable-next-line:directive-class-suffix
export class DebtComponent implements OnInit {
  constructor(private dialogRef: MatDialogRef<DebtComponent>,
    private homeService: HomeService,
    public excelService: ExcelService) { }

  public grabado = false;
  public services: any[];
  public minDate = new Date(2000, 0, 1);
  public maxDate = new Date(2050, 0, 1);
  public isPartial = false;
  public nuevaDeuda: any = {
    errores: {}
  };

  ngOnInit(): void {
    this.nuevaDeuda.service = this.excelService.service.name;
    this.isPartial = (this.excelService.service.dataType === 'P');
    this.homeService.getServicesActive()
      .subscribe(d => this.services = d);
  }

  MontoBlur(e) {
    let initalValue = parseFloat(e.amount);
    if(!isNaN(initalValue))
      e.amount = initalValue.toFixed(2);
  }

  cmbNewService() {
    delete this.nuevaDeuda.errores.service;
    let svc = this.services.find(s => s.name === this.nuevaDeuda.service);
    this.isPartial = (svc.dataType === 'P');
  }

  buscarNewCode() {
    if (this.nuevaDeuda.service === null || this.nuevaDeuda.service === undefined) {
      this.nuevaDeuda.errores.service = "Debe escoger un servicio";
      delete this.nuevaDeuda.code;
      return;
    }
    this.homeService.getDebtorCode(this.nuevaDeuda.service, this.nuevaDeuda.code)
      .subscribe(d => {
        if (d.id) {
          this.nuevaDeuda.firstName = d.firstName;
          delete this.nuevaDeuda.errores.firstName;
        }
      });
  }

  grabarNuevo() {
    if (!this.nuevaDeuda.service) {
      this.nuevaDeuda.errores.service = 'Debe escoger un servicio';
    }
    else {
      delete this.nuevaDeuda.errores.emissionDate;
    }

    if (!this.nuevaDeuda.emissionDate) {
      this.nuevaDeuda.errores.emissionDate = 'Fecha Inválida';
    }
    else {
      let emidate = new Date(this.nuevaDeuda.emissionDate).getFullYear();
      if (emidate <  2000 || emidate >  2050 ) {
        this.nuevaDeuda.errores.emissionDate = 'Fecha Inválida';
      }
      else {
        delete this.nuevaDeuda.errores.emissionDate;
      }
    }

    if (!this.isPartial) {
      if (!this.nuevaDeuda.dueDate) {
        this.nuevaDeuda.errores.dueDate = 'Fecha Inválida';
      }
      else {
        let dueyear = new Date(this.nuevaDeuda.dueDate).getFullYear();
        if (dueyear <  2000 || dueyear >  2050 ) {
          this.nuevaDeuda.errores.dueDate = 'Fecha Inválida';
        }
        else if (this.nuevaDeuda.emissionDate && this.nuevaDeuda.dueDate < this.nuevaDeuda.emissionDate) {
          this.nuevaDeuda.errores.dueDate = 'No debe ser menor a la fecha de emisión';
        }
        else {
          delete this.nuevaDeuda.errores.dueDate;
        }
      }

      if (this.nuevaDeuda.concept) {
        const re = new RegExp("^[ 0-9a-zA-Z]+$");
        if (this.nuevaDeuda.concept.length < 2) {
          this.nuevaDeuda.errores.concept = 'Debe tener 2 carácteres como mínimo';
        }
        else if (!re.test(this.nuevaDeuda.concept)) {
          this.nuevaDeuda.errores.concept = 'No cumple con el formato';
        }
        else {
          delete this.nuevaDeuda.errores.concept;
        }
      }
      else if (!this.nuevaDeuda.concept) {
        this.nuevaDeuda.errores.concept = 'Debe ingresar un valor'
      }
      else {
        delete this.nuevaDeuda.errores.concept;
      }

      let amount = parseFloat(this.nuevaDeuda.amount);
      if (!amount) {
        this.nuevaDeuda.errores.amount = 'Debe ingresar un valor';
      }
      else if (amount < 1) {
        this.nuevaDeuda.errores.amount = 'Ingrese un monto válido';
      }
      else if (amount > 999999999.99) {
        this.nuevaDeuda.errores.amount = 'Ingrese un monto válido'
      }
      else {
        delete this.nuevaDeuda.errores.amount;
      }
    }

    if (this.nuevaDeuda.code) {
      const re = new RegExp("^[0-9a-zA-Z]+$");
      if (this.nuevaDeuda.code.length < 1) {
        this.nuevaDeuda.errores.code = 'Debe tener 1 carácter como mínimo';
      }
      else if (!re.test(this.nuevaDeuda.code)) {
        this.nuevaDeuda.errores.code = 'No cumple con el formato';
      }
      else {
        delete this.nuevaDeuda.errores.code;
      }
    }
    else if (!this.nuevaDeuda.code) {
      this.nuevaDeuda.errores.code = 'Debe ingresar un valor'
    }
    else {
      delete this.nuevaDeuda.errores.code;
    }

    if (this.nuevaDeuda.firstName) {
      const re = new RegExp("^[ 0-9a-zA-ZñÑáÁéÉíÍóÓúÚäÄëËïÏöÖüÜ'&-]+$");
      if (this.nuevaDeuda.firstName.length < 3) {
        this.nuevaDeuda.errores.firstName = 'Debe tener 3 carácteres como mínimo';
      }
      else if (!re.test(this.nuevaDeuda.firstName)) {
        this.nuevaDeuda.errores.firstName = 'No cumple con el formato';
      }
      else {
        delete this.nuevaDeuda.errores.firstName;
      }
    }
    else {
      this.nuevaDeuda.errores.firstName = 'Debe ingresar un valor';
    }

    for(var s in this.nuevaDeuda.errores) {
      console.log(this.nuevaDeuda);
      if (this.nuevaDeuda.errores[s]) {
        console.log('Formulario con errores');
        return;
      }
    }

    let debt: any;
    if (this.isPartial) {
      debt = {
        emissionDate: this.nuevaDeuda.emissionDate,
        code: this.nuevaDeuda.code,
        firstName: this.nuevaDeuda.firstName,
      };
    }
    else {
      debt = {
        emissionDate: this.nuevaDeuda.emissionDate,
        dueDate: this.nuevaDeuda.dueDate,
        code: this.nuevaDeuda.code,
        firstName: this.nuevaDeuda.firstName,
        concept: this.nuevaDeuda.concept,
        amount: this.nuevaDeuda.amount
      };
    }
    this.homeService.postNewDebt(this.nuevaDeuda.service, debt)
      .subscribe(r => {
        if (r.success) {
          this.grabado = true;
          Swal.fire({
            title: 'Agregar Cobro' ,
            html: 'Se ha agregado el cobro.<br />¿Que desea hacer?',
            showCancelButton: true,
            showCloseButton: true,
            confirmButtonText: 'AGREGRA OTRO',
            cancelButtonText: 'CERRAR',
            onOpen: drawPopup
          }).then(result => {
            if (result.value) {
              this.nuevaDeuda = { service: this.excelService.service.name, errores: {} };
            }
            else {
              this.dialogRef.close({ grabado: this.grabado });
            }
          });
        }
        else {
          Swal.fire({
            title: 'Agregar Cobro' ,
            html: r.message,
            showCloseButton: true,
            showCancelButton: false,
            showConfirmButton: true,
            confirmButtonText: 'CERRAR',
            onOpen: drawPopup
          });
        }
      });
  }

  cerrarDialog() {
    this.dialogRef.close({ grabado: this.grabado });
  }
}
