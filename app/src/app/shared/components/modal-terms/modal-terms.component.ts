import { Component } from '@angular/core';
import { AutoFocusModule } from 'primeng/autofocus'; // Import AutoFocusModule

@Component({
  selector: 'cs-modal-terms',
  templateUrl: './modal-terms.component.html',
  standalone: true,
  imports: [AutoFocusModule], // Add AutoFocusModule to imports
})
export class ModalTermsComponent {}
