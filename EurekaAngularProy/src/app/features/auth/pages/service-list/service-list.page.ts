import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IErrorMessages } from '../../../../shared/models/forms';
import { swalAlert } from '../../../../shared/utils/helpers/popups';
import { authFullRoutingNames } from '../../auth-routing.names';
import { AffiliationService } from '../../services/affiliation.service';

@Component({
  selector: 'cs-service-list',
  templateUrl: './service-list.page.html',
  styleUrls: ['./service-list.page.scss'],
})
export class ServiceListPage implements OnInit {
  showSidebar = false;
  position: number;
  errorMessages: IErrorMessages;

  constructor(private router: Router, public affiliation: AffiliationService) {}

  ngOnInit() {
    this.errorMessages = {
      ...this.affiliation.errorMessagesServiceConfig,
      ...this.affiliation.errorMessagesService,
    };
  }

  actionDelete(position: number) {
    swalAlert
      .fire({
        text: 'Se eliminará el servicio de los canales de interbank',
        title: 'Eliminación total el servicio',
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: 'CONFIRMAR',
        cancelButtonText: 'CANCELAR',
        allowOutsideClick: false,
      })
      .then(({ value }) => {
        if (value) {
          this.affiliation.deleteService(position);
        }
      });
  }

  actionEdit(position: number) {
    this.affiliation.setEditForm(position);
    this.position = position;
    this.showSidebar = true;
  }

  finalize() {
    this.affiliation.saveAllServices().then(() => {
      this.router.navigate([authFullRoutingNames.REGISTRATION_FINISHED]);
    });
  }

  updateService(data) {
    this.affiliation.updateService(this.position, data);
    this.showSidebar = false;
  }
}
