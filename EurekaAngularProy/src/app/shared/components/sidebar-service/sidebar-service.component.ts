import { Component, Input } from '@angular/core';

@Component({
  selector: 'cs-sidebar-service',
  templateUrl: './sidebar-service.component.html',
  styleUrls: ['./sidebar-service.component.scss'],
})
export class SidebarServiceComponent {
  @Input() position: number;
  @Input() existServices = false;
  @Input() showAllTypes = false;
}
