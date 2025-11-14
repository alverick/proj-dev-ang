import { Component, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'cs-internal-service-add',
    templateUrl: './service-add.page.html',
    standalone: true,
    imports: [RouterOutlet]
})
export class ServiceAddPage {
  @HostListener('window:beforeunload', ['$event'])
  unloadHandler(event: Event) {
    event.preventDefault();
  }
}
