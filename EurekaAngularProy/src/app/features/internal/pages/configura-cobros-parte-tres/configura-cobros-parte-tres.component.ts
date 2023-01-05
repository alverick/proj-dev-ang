import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IServiceModel } from 'src/app/shared/models';
import { AfiliacionService } from 'src/app/shared/services/afiliacion.service';
import { drawPopup } from 'src/app/shared/utils/helpers/popups';
import Swal from 'sweetalert2';
import {
  internalAuthFullRoutingNames,
  internalFullRoutingNames,
} from '../../internal-routing.names';

@Component({
  selector: 'cs-configura-cobros-parte-tres',
  templateUrl: './configura-cobros-parte-tres.component.html',
  styleUrls: ['./configura-cobros-parte-tres.component.scss'],
  styles: [
    `
      :host >>> .tooltip-inner {
        background-color: #fff;
        color: #0d131d !important;
        border-radius: 4px;
        box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.2);
        font-size: 11px !important;
        padding: 0.5em 0.3em;
        min-width: 300px !important;
      }
      :host >>> .tooltip.top .tooltip-arrow:before,
      :host >>> .tooltip.top .tooltip-arrow {
        border-top-color: #0d131d57;
        filter: brightness(0.5);
      }
    `,
  ],
})
export class ConfiguraCobrosParteTresComponent implements OnInit {
  frm: UntypedFormGroup;
  submittedRequired = false;
  _service: IServiceModel;
  editMode: boolean = false;
  affiliationFlow: boolean = false;
  simboloMoneda: string = 'S/';
  currencySymbolSoles: string = 'S/';
  currencySymbolDollars: string = '$';
  //public comAgente = 1.5;
  private tc: number = 3.37;
  commissionAgentSoles = 1.5;
  commissionAgentDollars =
    Math.round((this.commissionAgentSoles / this.tc) * 100) / 100;
  //public comTienda = 8;
  commissionStoreSoles = 8;
  commissionStoreDollars =
    Math.round((this.commissionStoreSoles / this.tc) * 100) / 100;
  useAgencyChannel: boolean = false;

  get f(): any {
    return this.frm.controls;
  }

  constructor(
    private router: Router,
    private afiliacionService: AfiliacionService,
    private fb: UntypedFormBuilder,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.data.subscribe((d) => {
      //this.editMode = d.isEdit;
      this.affiliationFlow = d.affiliationFlow;
    });

    this.editMode = this.afiliacionService.editMode;
    this._service = Object.assign(
      {},
      this.afiliacionService.currentServiceModel
    );

    this.afiliacionService.GetTipoCambio().subscribe((d) => {
      this.tc = d;
      this.calculateCommissions();
    });

    this.frm = this.fb.group({
      usaAgente: new UntypedFormControl({
        value: this._service.usaAgente,
        disabled: this.editMode,
      }),
      usaTienda: new UntypedFormControl({
        value: this._service.usaTienda,
        disabled: this.editMode,
      }),
      usaWebApp: new UntypedFormControl({
        value: this._service.usaWebApp,
        disabled: true,
      }),
    });

    if (this.affiliationFlow == true) {
      this.showAgencyChannel(false);
    } else {
      this.showAgencyChannel(this._service.useAgencyChannel);
    }
  }

  goBack() {
    if (this.affiliationFlow == true) {
      this.router.navigate([
        internalAuthFullRoutingNames.CHARGES_AFFILIATION_ADD_STEP_2,
      ]);
    } else {
      this.router.navigate([internalFullRoutingNames.CHARGES_ADD_STEP_2]);
    }
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
          text: 'Debe escoger un medio de pago',
          showCloseButton: true,
          showCancelButton: true,
          showConfirmButton: false,
          cancelButtonText: 'CERRAR',
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
    this.afiliacionService.currentServiceModel.usaWebApp =
      this.f.usaWebApp.value;
    this.afiliacionService.currentServiceModel.usaAgente =
      this.f.usaAgente.value;
    this.afiliacionService.currentServiceModel.usaTienda =
      this.f.usaTienda.value;
  }

  nextPage() {
    if (this.affiliationFlow === true) {
      this.router.navigate([
        internalAuthFullRoutingNames.CHARGES_AFFILIATION_ADD_STEP_4,
      ]);
    } else {
      this.router.navigate([internalFullRoutingNames.CHARGES_ADD_STEP_4]);
    }
  }

  calculateCommissions() {
    this.commissionAgentDollars =
      Math.round((this.commissionAgentSoles / this.tc) * 100) / 100;
    this.commissionStoreDollars =
      Math.round((this.commissionStoreSoles / this.tc) * 100) / 100;
  }

  showAgencyChannel(show: boolean) {
    this.useAgencyChannel = show;
  }
}
