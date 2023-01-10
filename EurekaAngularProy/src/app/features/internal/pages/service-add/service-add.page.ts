import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'cs-internal-service-add',
  templateUrl: './service-add.page.html',
  styleUrls: ['./service-add.page.scss'],
})
export class ServiceAddPage {
  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    confirm(
      'El registro de tu empresa no ha concluido, si sales ahora los cambios se perderán.'
    );
    event.returnValue = false;
  }
}
