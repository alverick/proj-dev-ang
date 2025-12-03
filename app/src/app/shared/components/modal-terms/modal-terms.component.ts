import { Component } from '@angular/core';
import { AutoFocusModule } from 'primeng/autofocus';

@Component({
  selector: 'cs-modal-terms',
  templateUrl: './modal-terms.component.html',
  standalone: true,
  imports: [AutoFocusModule],
})
export class ModalTermsComponent {}
