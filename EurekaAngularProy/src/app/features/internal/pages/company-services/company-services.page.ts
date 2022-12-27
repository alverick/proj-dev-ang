import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import {
  errorServiceConfiguration,
  errorServiceInformation,
} from '../../../../shared/constants/company-errors';
import {
  chargeTypeOptions,
  currencyOptions,
  debtorCodeOptions,
  interestTypeOptions,
  paymentTypeOptions,
} from '../../../../shared/constants/services';
import { ServicesFormsService } from '../../../../shared/services';
import { GoogleAnalytics } from '../../../../shared/services/googleAnalytics.service';
import { swalAlert } from '../../../../shared/utils/helpers/popups';
import { internalFullRoutingChildNames } from '../../internal-routing.names';
import { CompanyServicesService } from '../../services';

@Component({
  host: { class: 'tw-w-full' },
  selector: 'cs-company-services',
  templateUrl: './company-services.page.html',
  styleUrls: ['./company-services.page.scss'],
})
export class CompanyServicesPage implements OnInit {
  showSidebar = false;
  position: number;
  errorMessages = {
    ...errorServiceConfiguration,
    ...errorServiceInformation,
  };
  debtorCodeOptions = debtorCodeOptions;
  paymentTypeOptions = paymentTypeOptions;
  currencyOptions = currencyOptions;
  chargeTypeOptions = chargeTypeOptions;
  interestTypeOptions = interestTypeOptions;
  formData;
  ngOnInit() {}

  constructor(
    public companyServices: CompanyServicesService,
    private serviceForms: ServicesFormsService,
    private activatedRoute: ActivatedRoute,
    private gaService: GoogleAnalytics,
    private router: Router,
    private logger: NGXLogger
  ) {
    this.logger.debug(
      '-> this.companyServicesService.services',
      this.companyServices.services
    );
    this.activatedRoute.data.subscribe((value: any) => {
      this.companyServices.services = value.services;
    });
  }

  actionDelete(position: number) {
    this.companyServices.canDelete(position).subscribe((result) => {
      const title = '¿Estás seguro que deseas eliminar este servicio?';
      let text =
        'Se eliminará el servicio de los canales Interbank y las deudas cargadas a este servicio';
      if (result.hasPayed) {
        text =
          'Ya existe un historial de pagos realizados con este servicio, sólo se eliminarán las ' +
          'deudas pendientes. Ya no se podrá pagar más este servicio por los canales de Interbank';
      }
      swalAlert
        .fire({
          text,
          title,
          showCancelButton: true,
          showConfirmButton: true,
          confirmButtonText: 'CONFIRMAR',
          cancelButtonText: 'CANCELAR',
        })
        .then((confirm) => {
          if (confirm.value) {
            this.gaService.sendEvent('ServicioEliminado', {
              event_category: GoogleAnalytics.Afiliacion,
              event_label: 'servicio_eliminado',
            });
            this.companyServices.deleteService(position);
          }
        });
    });
  }
  actionEdit(position: number) {
    this.formData = this.companyServices.setEditForm(position);
    this.position = position;
    setTimeout(() => {
      this.showSidebar = true;
    }, 200);
  }

  onClosePanel() {}

  createService() {
    this.serviceForms.resetServicesForms();
    this.router.navigate([internalFullRoutingChildNames.SERVICES_ADD_INFO]);
  }

  updateService() {
    this.companyServices.updateEditService(this.position).subscribe(() => {
      this.companyServices.getServices().subscribe(() => {
        this.showSidebar = false;
      });
    });
  }
}
