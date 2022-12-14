import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
  selector: 'cs-modal-terms',
  templateUrl: './modal-terms.component.html',
  styleUrls: ['./modal-terms.component.scss'],
})
export class ModalTermsComponent {
  constructor(public dialogRef: MatDialogRef<ModalTermsComponent>) {}

  close() {
    this.dialogRef.close();
  }
}
