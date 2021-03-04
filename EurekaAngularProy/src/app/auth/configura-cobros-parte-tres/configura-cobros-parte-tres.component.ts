import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup } from "@angular/forms";

import { AfiliacionService } from "src/app/shared/services/afiliacion.service";
import { Router } from "@angular/router";
import { ServiceModel } from "src/app/shared/models";
import Swal from "sweetalert2";
import { drawPopup } from "src/app/shared/services/popups";

@Component({
  selector: "app-configura-cobros-parte-tres",
  templateUrl: "./configura-cobros-parte-tres.component.html",
  styleUrls: ["./configura-cobros-parte-tres.component.scss"],
})
export class ConfiguraCobrosParteTresComponent implements OnInit {
  frm: FormGroup;
  submittedRequired = false;
  _service: ServiceModel;
  editMode: boolean = false;
  simboloMoneda: string = "S/";
  currencySymbolSoles: string = "S/";
  currencySymbolDollars: string = "$";
  //public comAgente = 1.5;
  private tc: number = 3.37;
  commissionAgentSoles = 1.5;
  commissionAgentDollars = Math.round((this.commissionAgentSoles / this.tc) * 100) / 100;;
  //public comTienda = 8;
  commissionStoreSoles = 8;
  commissionStoreDollars =  Math.round((this.commissionStoreSoles / this.tc) * 100) / 100;;

  get f(): any {
    return this.frm.controls;
  }

  constructor(
    private router: Router,
    private afiliacionService: AfiliacionService,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.editMode = this.afiliacionService.editMode;
    this._service = Object.assign(
      {},
      this.afiliacionService.currentServiceModel
    );

    this.afiliacionService.GetTipoCambio().subscribe((d) => {
      this.tc = d;
      console.log(this.tc);
      this.calculateCommissions();
    });

    this.frm = this.fb.group({
      usaAgente: new FormControl({
        value: this._service.usaAgente,
        disabled: this.editMode,
      }),
      usaTienda: new FormControl({
        value: this._service.usaTienda,
        disabled: this.editMode,
      }),
      usaWebApp: new FormControl({
        value: this._service.usaWebApp,
        disabled: true,
      }),
    });
  }

  goBack() {
    this.router.navigate(["/configuraCobrosParteDos"]);
  }

  onSubmitServicio() {
    this.submittedRequired = true;
    if (this.frm.valid) {
      if (
        this.f.usaAgente.value === false &&
        this.f.usaTienda.value === false &&
        this.f.usaWebApp.value === false
      ) {
        Swal.fire({
          text: "Debe escoger un medio de pago",
          showCloseButton: true,
          showCancelButton: true,
          showConfirmButton: false,
          cancelButtonText: "CERRAR",
          allowOutsideClick: false,
          onOpen: drawPopup,
        });
      } else {
        this.setCurrentServiceModel();
        this.nextPage();
      }
    }
  }

  setCurrentServiceModel() {
    this.afiliacionService.currentServiceModel.usaWebApp = this.f.usaWebApp.value;
    this.afiliacionService.currentServiceModel.usaAgente = this.f.usaAgente.value;
    this.afiliacionService.currentServiceModel.usaTienda = this.f.usaTienda.value;
    console.log(this.afiliacionService.currentServiceModel);
  }

  nextPage() {
    this.router.navigate(["/configuraCobrosParteCuatro"]);
  }

  calculateCommissions() {
    this.commissionAgentDollars =
      Math.round((this.commissionAgentSoles / this.tc) * 100) / 100;
    this.commissionStoreDollars =
      Math.round((this.commissionStoreSoles / this.tc) * 100) / 100;
  }
}
