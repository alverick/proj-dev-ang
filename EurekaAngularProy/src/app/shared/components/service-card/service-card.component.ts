import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { dataTypeOptions } from '../../../features/auth/constants';
import { IServiceRemoteModel } from '../../models';

@Component({
  selector: 'cs-service-card',
  templateUrl: './service-card.component.html',
  styleUrls: ['./service-card.component.scss'],
})
export class ServiceCardComponent implements OnInit {
  @Input() serviceData: IServiceRemoteModel;
  @Input() position: number;
  @Input() canEdit = true;
  @Input() update = false;
  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();
  paymentChannels = '';
  dataType = '';
  name = '';
  updateEditable = false;

  ngOnInit() {
    this.setPaymentChannels();
    this.setDataType();
    this.isEditable();
  }

  isEditable() {
    if (this.update) {
      this.updateEditable = this.serviceData.inReview;
    }
  }

  setDataType() {
    this.dataType =
      dataTypeOptions.find(({ value }) => value === this.serviceData.dataType)
        .label || '';
  }

  setPaymentChannels() {
    const channels = [
      { key: 'useAppWeb', label: 'Digital' },
      { key: 'useAgent', label: 'Agentes' },
    ];
    this.paymentChannels = channels
      .filter(({ key }) => this.serviceData[key])
      .map(({ label }) => label)
      .join(', ');
  }

  actionEdit() {
    this.edit.emit(this.position);
  }
  actionDelete() {
    this.delete.emit(this.position);
  }
}
